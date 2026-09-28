/**
 * POST /api/payments/create-order
 * Creates a Razorpay order and a pending payment record.
 */

import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { createPaymentOrder } from "@/lib/payments/payment-service";
import { logActivity } from "@/lib/logging/activity-logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CreateOrderSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address.")
    .transform((e) => e.trim().toLowerCase()),
  resultId: z.string().min(1, "Result ID is required."),
  imageUrl: z.string().url("Invalid image URL."),
  previewUrl: z.string().url("Invalid preview URL."),
  dimensions: z.string().optional(),
  format: z.string().optional(),
  sizeKb: z.number().optional(),
  countryCode: z.string().optional(),
  countryName: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateOrderSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        {
          success: false,
          error: firstError?.message || "Invalid request data.",
          field: firstError?.path?.[0],
        },
        { status: 422 }
      );
    }

    const data = parsed.data;

    // Hash IP for analytics — never store raw IP
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";
    const ipHash = crypto.createHash("sha256").update(ip).digest("hex").slice(0, 16);

    const userAgent = req.headers.get("user-agent") || undefined;

    await logActivity({
      event: "checkout_initiated",
      status: "started",
      email: data.email,
      metadata: { resultId: data.resultId },
    });

    const order = await createPaymentOrder({
      email: data.email,
      resultId: data.resultId,
      imageUrl: data.imageUrl,
      previewUrl: data.previewUrl,
      dimensions: data.dimensions,
      format: data.format,
      sizeKb: data.sizeKb,
      countryCode: data.countryCode,
      countryName: data.countryName,
      userAgent,
      ipHash,
    });

    return NextResponse.json({
      success: true,
      paymentId: order.paymentId,
      razorpayOrderId: order.razorpayOrderId,
      amount: order.amount,
      currency: order.currency,
      keyId: order.keyId,
    });
  } catch (err: unknown) {
    console.error("[create-order] Error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to create payment order.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
