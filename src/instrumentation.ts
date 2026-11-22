/**
 * Runs once when the Next.js server starts. Opens the MongoDB connection and creates indexes
 * up front, so the first customer after a deploy/restart doesn't pay for it.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || !process.env.MONGODB_URI) return;
  try {
    const [{ getPaymentCollection }, { getActivityLogCollection }] = await Promise.all([
      import("@/lib/models/Payment"),
      import("@/lib/models/UserActivityLog"),
    ]);
    await Promise.all([getPaymentCollection(), getActivityLogCollection()]);
  } catch (err) {
    // Never block server start; the first request will retry
    console.warn("[instrumentation] DB warm-up failed:", err instanceof Error ? err.message : err);
  }
}
