/**
 * Razorpay Server SDK Wrapper
 * Keeps the secret key exclusively on the server.
 */

import Razorpay from "razorpay";
import crypto from "crypto";

const KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET!;

let _instance: Razorpay | null = null;

export function getRazorpayInstance(): Razorpay {
  if (!KEY_ID || !KEY_SECRET) {
    throw new Error("Razorpay credentials are not configured.");
  }
  if (!_instance) {
    _instance = new Razorpay({
      key_id: KEY_ID,
      key_secret: KEY_SECRET,
    });
  }
  return _instance;
}

/**
 * Create a Razorpay order.
 */
export async function createRazorpayOrder(params: {
  amount: number; // in pence/smallest unit
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}) {
  const rz = getRazorpayInstance();
  const order = await rz.orders.create({
    amount: params.amount,
    currency: params.currency,
    receipt: params.receipt,
    notes: params.notes || {},
  });
  return order;
}

/**
 * Verify Razorpay payment signature using timing-safe comparison.
 */
export function verifyPaymentSignature(params: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): boolean {
  if (!KEY_SECRET) return false;

  const body = `${params.razorpayOrderId}|${params.razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", KEY_SECRET)
    .update(body)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(params.razorpaySignature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
  } catch {
    return false;
  }
}

/**
 * Verify Razorpay webhook signature using timing-safe comparison.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string
): boolean {
  if (!WEBHOOK_SECRET) return false;

  const expected = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expected, "hex")
    );
  } catch {
    return false;
  }
}
