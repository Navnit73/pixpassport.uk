/**
 * GET /api/download/[token]
 * Protected image download — validates token, payment status, and expiry.
 */

import { NextResponse, type NextRequest } from "next/server";
import { getPaymentCollection } from "@/lib/models/Payment";
import { logActivity } from "@/lib/logging/activity-logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ token: string }>;
}

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { token } = await context.params;

    if (!token || token.length < 32) {
      return NextResponse.json(
        { error: "Invalid download token." },
        { status: 400 }
      );
    }

    const col = await getPaymentCollection();
    const payment = await col.findOne({ downloadToken: token });

    if (!payment) {
      return NextResponse.json(
        { error: "Download link not found or has expired." },
        { status: 404 }
      );
    }

    // Verify payment is paid
    if (payment.status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed." },
        { status: 403 }
      );
    }

    // Check token expiry
    if (
      payment.downloadTokenExpiresAt &&
      new Date(payment.downloadTokenExpiresAt) < new Date()
    ) {
      await logActivity({
        event: "download_link_expired",
        status: "expired",
        paymentId: payment.paymentId,
        email: payment.email,
      });

      return NextResponse.json(
        {
          error:
            "This download link has expired. Please contact support for a new link.",
        },
        { status: 410 }
      );
    }

    // Get the full-resolution image URL (image_url, not preview_url)
    const imageUrl = payment.image?.imageUrl;
    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image not available." },
        { status: 404 }
      );
    }

    // Fetch the image from Cloudinary and stream it
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: "Failed to retrieve image." },
        { status: 502 }
      );
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType =
      imageResponse.headers.get("content-type") || "image/jpeg";

    // Safe filename
    const countryCode = payment.metadata?.countryCode?.toLowerCase() || "photo";
    const filename = `passport-photo-${countryCode}-${payment.paymentId.slice(0, 8)}.jpg`;

    await logActivity({
      event: "image_downloaded",
      status: "success",
      paymentId: payment.paymentId,
      email: payment.email,
    });

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-cache, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err: unknown) {
    console.error("[download] Error:", err);
    return NextResponse.json(
      { error: "Download failed. Please try again." },
      { status: 500 }
    );
  }
}
