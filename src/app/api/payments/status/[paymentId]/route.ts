/**
 * GET /api/payments/status/[paymentId]
 * Check payment status — used by the preview page to poll after payment.
 */

import { NextResponse, type NextRequest } from "next/server";
import { getPaymentById } from "@/lib/payments/payment-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ paymentId: string }>;
}

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { paymentId } = await context.params;

    if (!paymentId) {
      return NextResponse.json(
        { success: false, error: "Payment ID is required." },
        { status: 400 }
      );
    }

    const payment = await getPaymentById(paymentId);

    if (!payment) {
      return NextResponse.json(
        { success: false, error: "Payment not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentId: payment.paymentId,
      status: payment.status,
      fulfillmentStatus: payment.fulfillmentStatus,
      downloadToken: payment.status === "paid" ? payment.downloadToken : undefined,
      paidAt: payment.paidAt,
    });
  } catch (err: unknown) {
    console.error("[payment-status] Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to check payment status." },
      { status: 500 }
    );
  }
}
