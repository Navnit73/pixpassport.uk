/**
 * POST /api/payments/verify
 * Verifies Razorpay payment signature, marks payment as paid,
 * and triggers fulfillment.
 */

import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { verifyPaymentSignature } from "@/lib/payments/razorpay";
import { markPaymentPaid } from "@/lib/payments/payment-service";
import { fulfillPayment } from "@/lib/payments/fulfillment-service";
import { logActivity } from "@/lib/logging/activity-logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VerifySchema = z.object({
  paymentId: z.string().min(1),
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = VerifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid verification data." },
        { status: 422 }
      );
    }

    const data = parsed.data;

    // Verify signature using timing-safe comparison
    const isValid = verifyPaymentSignature({
      razorpayOrderId: data.razorpayOrderId,
      razorpayPaymentId: data.razorpayPaymentId,
      razorpaySignature: data.razorpaySignature,
    });

    if (!isValid) {
      await logActivity({
        event: "payment_failed",
        status: "invalid_signature",
        paymentId: data.paymentId,
        metadata: { razorpayOrderId: data.razorpayOrderId },
      });

      return NextResponse.json(
        { success: false, error: "Payment verification failed." },
        { status: 400 }
      );
    }

    // Mark as paid (idempotent)
    const { transitioned, payment } = await markPaymentPaid({
      razorpayOrderId: data.razorpayOrderId,
      razorpayPaymentId: data.razorpayPaymentId,
    });

    if (!payment) {
      return NextResponse.json(
        { success: false, error: "Payment record not found." },
        { status: 404 }
      );
    }

    await logActivity({
      event: "payment_success",
      status: transitioned ? "newly_paid" : "already_paid",
      paymentId: payment.paymentId,
      email: payment.email,
      metadata: {
        razorpayOrderId: data.razorpayOrderId,
        razorpayPaymentId: data.razorpayPaymentId,
      },
    });

    // Trigger fulfillment (invoice generation, download token, email delivery)
    let downloadToken = payment.downloadToken;
    let invoiceNumber = payment.invoice?.invoiceNumber;
    try {
      const fulfillment = await fulfillPayment(payment.paymentId);
      downloadToken = fulfillment.downloadToken || downloadToken;
      invoiceNumber = fulfillment.invoiceNumber || invoiceNumber;
    } catch (fulfillErr) {
      console.error("[verify] Fulfillment error:", fulfillErr);
    }

    return NextResponse.json({
      success: true,
      paymentId: payment.paymentId,
      status: payment.status,
      downloadToken,
      invoiceNumber,
    });
  } catch (err: unknown) {
    console.error("[verify] Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Payment verification failed. Please contact support.",
      },
      { status: 500 }
    );
  }
}
