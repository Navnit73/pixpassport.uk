/**
 * Client-side helpers for sending a photo to the PixPassport processing proxy
 * (POST /api/passport-photo) and handing the result to /preview/[id].
 *
 * Shared by PhotoMakerStudio and PassportPhotoChecker so both flows store the
 * exact payload shape the preview page reads.
 */

import type { PassportProcessResult } from "@/lib/passport-api";

export interface ProcessedResultMeta {
  countryCode: string;
  countryName: string;
  documentType: string;
  /** "widthxheight" in pixels, e.g. "600x750". */
  targetDimensions?: string;
  /** Data URL of the photo the user uploaded, shown on the preview page. */
  originalPreview?: string | null;
}

/** Uploads a photo to the server-side proxy and returns the processed result. */
export async function requestPhotoProcessing(
  file: File,
  countryCode: string,
  documentType: string
): Promise<PassportProcessResult> {
  const fileExt = file.name.split(".").pop() || "jpg";
  const freshFile = new File([file], `upload_${Date.now()}.${fileExt}`, {
    type: file.type,
  });

  const formData = new FormData();
  formData.append("image", freshFile);
  formData.append("country_code", countryCode);
  formData.append("document_type", documentType || "passport");

  const res = await fetch("/api/passport-photo", {
    method: "POST",
    body: formData,
  });

  let data: PassportProcessResult;
  try {
    data = await res.json();
  } catch {
    throw new Error("The photo service returned an unexpected response. Please try again.");
  }
  if (!res.ok || data.status === "error" || data.error) {
    throw new Error(data.error || "Failed to process passport photo.");
  }
  return data;
}

/**
 * Stores a processed result where /preview/[id] looks for it and returns the
 * result id to navigate to.
 */
export function saveProcessedResult(
  result: PassportProcessResult,
  meta: ProcessedResultMeta
): string {
  const timestamp = Date.now();
  const resultId =
    result.result_id || `res_${meta.countryCode.toLowerCase()}_${timestamp}`;

  const payload = {
    ...result,
    result_id: resultId,
    country_code: meta.countryCode,
    country_name: meta.countryName,
    target_dimensions: meta.targetDimensions,
    document_type: meta.documentType,
    original_preview: meta.originalPreview ?? undefined,
    timestamp,
  };

  if (typeof window !== "undefined") {
    const json = JSON.stringify(payload);
    try {
      sessionStorage.setItem(`pixpassport_${resultId}`, json);
      sessionStorage.setItem("pixpassport_latest", json);
      localStorage.setItem(`pixpassport_${resultId}`, json);
      localStorage.setItem("pixpassport_latest", json);
    } catch {
      // Storage full or blocked: the preview page falls back to its own lookup.
    }
  }

  return resultId;
}

/** Reads a file as a data URL (used for the "original photo" preview). */
export function readFileAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Failed to read image file"));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
