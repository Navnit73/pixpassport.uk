/**
 * PixPassport API Client Helper
 * Official Endpoint: https://api.pixpassport.com/process
 *
 * Designed for server-side Next.js route handlers and server actions
 * to ensure the API key is never exposed to the client browser.
 */

const API_BASE_URL =
  process.env.PIX_PASSPORT_API_URL || "https://api.pixpassport.com";
const API_KEY = process.env.PIX_PASSPORT_API_KEY || "";

export interface PassportMetrics {
  head_height_pct?: number;
  eye_position_pct?: number;
  top_margin_pct?: number;
  background_valid?: boolean;
  background_corrected?: boolean;
}

export interface PassportProcessResult {
  status: "success" | "error" | string;
  result_id?: string;
  image_url?: string;
  preview_url?: string;
  dimensions?: string;
  format?: string;
  size_kb?: number;
  metrics?: PassportMetrics;
  error?: string;
  message?: string;
}

export interface PassportProcessOptions {
  country_code: string; // e.g. "GB", "AU", "US"
  document_type?: string; // default: "passport"
}

/**
 * Creates headers for authenticated requests to https://api.pixpassport.com/process
 */
export function getPassportApiHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    accept: "*/*",
  };

  if (API_KEY) {
    headers["X-API-Key"] = API_KEY;
  }

  return headers;
}

/**
 * Uploads an image to the PixPassport API (/process) for compliance formatting.
 *
 * @param fileBuffer The raw image Buffer or Blob
 * @param fileName Original file name
 * @param options Country code and document type
 * @param mimeType Optional MIME type (e.g. image/jpeg)
 */
export async function processPassportPhoto(
  fileBuffer: Blob | Buffer,
  fileName: string = "passport-photo.jpg",
  options: PassportProcessOptions = {
    country_code: "GB",
    document_type: "passport",
  },
  mimeType: string = "image/jpeg"
): Promise<PassportProcessResult> {
  try {
    const formData = new FormData();

    let blob: Blob;
    if (fileBuffer instanceof Blob) {
      blob = fileBuffer.type ? fileBuffer : new Blob([fileBuffer], { type: mimeType });
    } else {
      // Convert Node Buffer to Uint8Array for standard Blob
      const uint8 = new Uint8Array(fileBuffer);
      blob = new Blob([uint8], { type: mimeType });
    }

    formData.append("image", blob, fileName);
    formData.append("country_code", options.country_code || "GB");
    formData.append("document_type", options.document_type || "passport");

    const endpoint = `${API_BASE_URL.replace(/\/+$/, "")}/process`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: getPassportApiHeaders(),
      body: formData,
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      let parsedError = errorText;
      try {
        const json = JSON.parse(errorText);
        parsedError = json.detail || json.error || json.message || errorText;
        if (Array.isArray(parsedError)) {
          parsedError = parsedError
            .map((e: { msg?: string }) => e.msg || JSON.stringify(e))
            .join(", ");
        }
      } catch {
        // use raw text
      }

      return {
        status: "error",
        error: typeof parsedError === "string" ? parsedError : JSON.stringify(parsedError),
      };
    }

    const result: PassportProcessResult = await response.json();
    return result;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      status: "error",
      error: `Failed to connect to PixPassport API: ${message}`,
    };
  }
}
