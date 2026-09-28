/**
 * GET /api/invoices/[paymentId]
 * Serves verified invoice for paid orders (HTML or PDF).
 */

import { NextResponse, type NextRequest } from "next/server";
import { getPaymentById } from "@/lib/payments/payment-service";
import { generateInvoiceHtml, generateInvoiceNumber } from "@/lib/invoices/invoice-service";
import { generateInvoicePdfBuffer } from "@/lib/invoices/invoice-pdf";

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

    const format = req.nextUrl.searchParams.get("format");
    const isPdf = format === "pdf";

    // 1. PDF Delivery
    if (isPdf) {
      const pdfBuffer = await generateInvoicePdfBuffer({
        invoiceNumber,
        email: payment.email,
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

    // 2. HTML Delivery
    const html = generateInvoiceHtml({
      invoiceNumber,
      email: payment.email,
      amount: payment.amount,
      currency: payment.currency,
      razorpayPaymentId: payment.razorpayPaymentId || "N/A",
      razorpayOrderId: payment.razorpayOrderId || "N/A",
      paidAt: payment.paidAt || payment.updatedAt || new Date(),
      countryName: payment.metadata?.countryName,
      dimensions: payment.image?.dimensions,
    });

    const isDownload = req.nextUrl.searchParams.get("download") === "1";
    const headers: Record<string, string> = {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-cache, no-store",
    };

    if (isDownload) {
      headers["Content-Disposition"] = `attachment; filename="Invoice-${invoiceNumber}.html"`;
    }

    return new NextResponse(html, {
      status: 200,
      headers,
    });
  } catch (err: unknown) {
    console.error("[invoice] Error:", err);
    return NextResponse.json(
      { error: "Failed to generate invoice." },
      { status: 500 }
    );
  }
}
