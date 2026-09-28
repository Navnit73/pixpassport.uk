/**
 * Cloudinary Storage Utility
 * Handles secure server-side uploads of biometric assets and generated invoice PDFs.
 */

import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

/**
 * Upload an invoice PDF buffer to Cloudinary.
 * Returns the secure public URL or null if upload fails.
 */
export async function uploadInvoicePdfToCloudinary(params: {
  pdfBuffer: Buffer;
  invoiceNumber: string;
}): Promise<{ secureUrl: string; publicId: string } | null> {
  if (!cloudName || !apiKey || !apiSecret) {
    console.warn("[cloudinary] Missing Cloudinary credentials. Skipping invoice PDF cloud upload.");
    return null;
  }

  try {
    const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "passport/invoices",
          public_id: params.invoiceNumber,
          resource_type: "raw",
          format: "pdf",
          overwrite: true,
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Cloudinary upload returned empty response"));
          } else {
            resolve(result);
          }
        }
      );
      stream.end(params.pdfBuffer);
    });

    return {
      secureUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    };
  } catch (err) {
    console.error("[cloudinary] Failed to upload invoice PDF:", err);
    return null;
  }
}
