/**
 * Fulfillment Service
 * Orchestrates: mark paid → generate invoice & PDF → upload to Cloudinary → create download token → send email with PDF attachment.
 * Idempotent — safe to call multiple times for the same payment.
 */

import crypto from "crypto";
import { getPaymentCollection, type FulfillmentStatus } from "@/lib/models/Payment";
import { getPaymentById } from "@/lib/payments/payment-service";
import { generateInvoiceNumber } from "@/lib/invoices/invoice-service";
import { generateInvoicePdfBuffer } from "@/lib/invoices/invoice-pdf";
import { uploadInvoicePdfToCloudinary } from "@/lib/storage/cloudinary";
import { sendPaymentSuccessEmailAction } from "@/lib/email";
import { logActivity } from "@/lib/logging/activity-logger";
import { PRICING } from "@/lib/config/pricing";

export interface FulfillmentResult {
  downloadToken?: string;
  invoiceNumber?: string;
  invoicePdfUrl?: string;
  fulfillmentStatus: FulfillmentStatus;
}

/**
 * Full fulfillment pipeline. Idempotent — checks each step before executing.
 */
export async function fulfillPayment(paymentId: string): Promise<FulfillmentResult> {
  const col = await getPaymentCollection();
  const payment = await getPaymentById(paymentId);

  if (!payment) {
    console.error(`[fulfillment] Payment ${paymentId} not found.`);
    return { fulfillmentStatus: "failed" };
  }

  if (payment.status !== "paid") {
    console.error(`[fulfillment] Payment ${paymentId} is not paid (status: ${payment.status}).`);
    return { fulfillmentStatus: "failed" };
  }

  // If already completed, return existing credentials immediately
  if (payment.fulfillmentStatus === "completed" && payment.downloadToken) {
    return {
      downloadToken: payment.downloadToken,
      invoiceNumber: payment.invoice?.invoiceNumber,
      invoicePdfUrl: payment.invoice?.invoicePdfUrl,
      fulfillmentStatus: "completed",
    };
  }

  // Claim fulfillment lock atomically
  const lockResult = await col.updateOne(
    {
      paymentId,
      fulfillmentStatus: { $in: ["pending", "failed"] as FulfillmentStatus[] },
    },
    { $set: { fulfillmentStatus: "processing" as FulfillmentStatus, updatedAt: new Date() } }
  );

  // If another process has the lock, fetch and return latest state
  if (lockResult.modifiedCount === 0 && payment.fulfillmentStatus === "processing") {
    const latest = await getPaymentById(paymentId);
    return {
      downloadToken: latest?.downloadToken,
      invoiceNumber: latest?.invoice?.invoiceNumber,
      invoicePdfUrl: latest?.invoice?.invoicePdfUrl,
      fulfillmentStatus: latest?.fulfillmentStatus || "processing",
    };
  }

  try {
    // 1. Generate invoice number & PDF
    let invoiceNumber = payment.invoice?.invoiceNumber;
    let invoicePdfUrl = payment.invoice?.invoicePdfUrl;
    let pdfBuffer: Buffer | undefined;

    if (!invoiceNumber) {
      invoiceNumber = generateInvoiceNumber();
    }

    // Generate PDF buffer
    try {
      pdfBuffer = await generateInvoicePdfBuffer({
        invoiceNumber,
        email: payment.email,
        amount: payment.amount,
        currency: payment.currency,
        razorpayPaymentId: payment.razorpayPaymentId || "N/A",
        razorpayOrderId: payment.razorpayOrderId,
        paidAt: payment.paidAt || payment.updatedAt || new Date(),
        countryName: payment.metadata?.countryName,
        dimensions: payment.image?.dimensions,
      });
    } catch (pdfErr) {
      console.error("[fulfillment] PDF generation error:", pdfErr);
    }

    // 2. Upload Invoice PDF to Cloudinary (if not already uploaded)
    if (pdfBuffer && !invoicePdfUrl) {
      try {
        const uploadResult = await uploadInvoicePdfToCloudinary({
          pdfBuffer,
          invoiceNumber,
        });
        if (uploadResult) {
          invoicePdfUrl = uploadResult.secureUrl;
          await col.updateOne(
            { paymentId },
            {
              $set: {
                "invoice.invoicePdfUrl": uploadResult.secureUrl,
                "invoice.cloudinaryPublicId": uploadResult.publicId,
              },
            }
          );
        }
      } catch (uploadErr) {
        console.warn("[fulfillment] Cloudinary invoice upload warning:", uploadErr);
      }
    }

    // Persist invoice metadata
    await col.updateOne(
      { paymentId },
      {
        $set: {
          "invoice.invoiceNumber": invoiceNumber,
          "invoice.generatedAt": payment.invoice?.generatedAt || new Date(),
          updatedAt: new Date(),
        },
      }
    );

    await logActivity({
      event: "invoice_generated",
      status: "success",
      paymentId,
      email: payment.email,
      metadata: { invoiceNumber, invoicePdfUrl },
    });

    // 3. Generate download token (idempotent — skip if already exists and not expired)
    let downloadToken = payment.downloadToken;
    const tokenExpiry = payment.downloadTokenExpiresAt;
    const isTokenValid = downloadToken && tokenExpiry && new Date(tokenExpiry) > new Date();

    if (!isTokenValid) {
      downloadToken = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72 hours
      await col.updateOne(
        { paymentId },
        {
          $set: {
            downloadToken,
            downloadTokenExpiresAt: expiresAt,
            updatedAt: new Date(),
          },
        }
      );
    }

    // 4. Send email with PDF attachment (idempotent — skip if already sent)
    if (payment.emailDelivery?.status !== "sent") {
      const siteUrl = PRICING.siteUrl;
      const downloadUrl = `${siteUrl}/api/download/${downloadToken}`;
      const invoiceUrl = `${siteUrl}/api/invoices/${paymentId}`;

      try {
        const resendId = await sendPaymentSuccessEmailAction({
          email: payment.email,
          paymentId: payment.paymentId,
          razorpayPaymentId: payment.razorpayPaymentId || "",
          amount: payment.amount,
          currency: payment.currency,
          invoiceNumber: invoiceNumber!,
          downloadUrl,
          invoiceUrl,
          invoicePdfUrl,
          pdfBuffer,
          countryName: payment.metadata?.countryName,
          dimensions: payment.image?.dimensions,
        });

        await col.updateOne(
          { paymentId },
          {
            $set: {
              "emailDelivery.status": "sent",
              "emailDelivery.resendEmailId": resendId,
              "emailDelivery.sentAt": new Date(),
              updatedAt: new Date(),
            },
            $inc: { "emailDelivery.attempts": 1 },
          }
        );

        await logActivity({
          event: "email_sent",
          status: "success",
          paymentId,
          email: payment.email,
          metadata: { resendId, invoiceNumber, hasAttachment: !!pdfBuffer },
        });
      } catch (emailErr) {
        const errMsg = emailErr instanceof Error ? emailErr.message : "Unknown email error";
        await col.updateOne(
          { paymentId },
          {
            $set: {
              "emailDelivery.status": "failed",
              "emailDelivery.lastError": errMsg,
              updatedAt: new Date(),
            },
            $inc: { "emailDelivery.attempts": 1 },
          }
        );

        await logActivity({
          event: "email_failed",
          status: "error",
          paymentId,
          email: payment.email,
          metadata: { error: errMsg },
        });

        console.warn(`[fulfillment] Email delivery warning for ${paymentId}:`, errMsg);
      }
    }

    // 5. Mark fulfillment as completed
    await col.updateOne(
      { paymentId },
      { $set: { fulfillmentStatus: "completed" as FulfillmentStatus, updatedAt: new Date() } }
    );

    return {
      downloadToken,
      invoiceNumber,
      invoicePdfUrl,
      fulfillmentStatus: "completed",
    };
  } catch (err) {
    console.error(`[fulfillment] Critical error for ${paymentId}:`, err);
    await col.updateOne(
      { paymentId },
      { $set: { fulfillmentStatus: "failed" as FulfillmentStatus, updatedAt: new Date() } }
    );
    return { fulfillmentStatus: "failed" };
  }
}
