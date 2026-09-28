/**
 * GET /api/invoices/[paymentId]
 * Serves verified invoice for paid orders (HTML or PDF).
 */

import { NextResponse, type NextRequest } from "next/server";
import { getPaymentById } from "@/lib/payments/payment-service";
import { generateInvoiceHtml, generateInvoiceNumber } from "@/lib/invoices/invoice-service";
import { generateInvoicePdfBuffer } from "@/lib/invoices/invoice-pdf";
import { fetchRazorpayPayment, extractCustomerName } from "@/lib/payments/razorpay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ paymentId: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { paymentId } = await context.params;

    if (!paymentId) {
      return NextResponse.json(
        { error: "Payment ID is required." },
        { status: 400 }
      );
    }

    const payment = await getPaymentById(paymentId);

    if (!payment) {
      return NextResponse.json(
        { error: "Invoice not found." },
        { status: 404 }
      );
    }

    if (payment.status !== "paid") {
      return NextResponse.json(
        { error: "Invoice is only available for paid orders." },
        { status: 403 }
      );
    }

    const invoiceNumber =
      payment.invoice?.invoiceNumber ||
      generateInvoiceNumber();

    // Extract customer name from Razorpay payment details or formatted identity
    let customerName = extractCustomerName(undefined, payment.email);
    if (payment.razorpayPaymentId) {
      try {
        const rzPayment = await fetchRazorpayPayment(payment.razorpayPaymentId);
        if (rzPayment) {
          customerName = extractCustomerName(rzPayment, payment.email);
        }
      } catch (err) {
        console.warn("[invoice] Could not fetch Razorpay payment:", err);
      }
    }

    const format = req.nextUrl.searchParams.get("format");
    const download = req.nextUrl.searchParams.get("download");
    const isPdf = format === "pdf" || download === "1" || download === "pdf" || format === "download";

    // 1. PDF Delivery (When requested as PDF or Download)
    if (isPdf) {
      const pdfBuffer = await generateInvoicePdfBuffer({
        invoiceNumber,
        email: payment.email,
        customerName,
        amount: payment.amount,
        currency: payment.currency,
        razorpayPaymentId: payment.razorpayPaymentId || "N/A",
        razorpayOrderId: payment.razorpayOrderId || "N/A",
        paidAt: payment.paidAt || payment.updatedAt || new Date(),
        countryName: payment.metadata?.countryName,
        dimensions: payment.image?.dimensions,
      });

      return new NextResponse(new Uint8Array(pdfBuffer), {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="Invoice-${invoiceNumber}.pdf"`,
          "Cache-Control": "private, no-cache, no-store",
        },
      });
    }

    // 2. Interactive Web HTML View
    const html = generateInvoiceHtml({
      invoiceNumber,
      email: payment.email,
      customerName,
      amount: payment.amount,
      currency: payment.currency,
      razorpayPaymentId: payment.razorpayPaymentId || "N/A",
      razorpayOrderId: payment.razorpayOrderId || "N/A",
      paidAt: payment.paidAt || payment.updatedAt || new Date(),
      countryName: payment.metadata?.countryName,
      dimensions: payment.image?.dimensions,
    });

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "private, no-cache, no-store",
      },
    });
  } catch (err: unknown) {
    console.error("[invoice] Error:", err);
    return NextResponse.json(
      { error: "Failed to generate invoice." },
      { status: 500 }
    );
  }
}
