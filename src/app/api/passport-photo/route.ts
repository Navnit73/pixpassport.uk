import { NextResponse, type NextRequest } from "next/server";
import { processPassportPhoto } from "@/lib/passport-api";

export const runtime = "nodejs";

/**
 * Next.js API Route Proxy for https://api.pixpassport.com/process
 *
 * Endpoint: POST /api/passport-photo
 * Accepts: multipart/form-data with "image" (or "file"), "country_code", "document_type"
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") || formData.get("file");

    if (!image || !(image instanceof Blob)) {
      return NextResponse.json(
        {
          status: "error",
          error: "No image file provided. Please upload an image.",
        },
        { status: 400 }
      );
    }

    const countryCode =
      (formData.get("country_code") as string) ||
      (formData.get("country") as string) ||
      "GB";
    const documentType =
      (formData.get("document_type") as string) || "passport";

    const fileName =
      (image instanceof File && image.name) ? image.name : "photo.jpg";

    const result = await processPassportPhoto(image, fileName, {
      country_code: countryCode,
      document_type: documentType,
    });

    if (result.status === "error" || result.error) {
      return NextResponse.json(
        {
          status: "error",
          error: result.error || result.message || "Failed to process passport photo.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json(
      { status: "error", error: message },
      { status: 500 }
    );
  }
}
