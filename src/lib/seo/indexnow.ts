/**
 * IndexNow SEO Integration Service
 * Automatically notifies Bing, Yandex, Seznam, and other IndexNow-compliant search engines
 * whenever pages, tools, or articles are updated on PixPassport.
 */

import { getAllToolSlugs } from "@/lib/tools";

export const INDEXNOW_KEY = "0c3dc5e8833b46beb209705aa05e5683";
export const INDEXNOW_HOST = "pixpassport.uk";
export const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;

// IndexNow endpoint list (IndexNow protocol shares submissions across all participating search engines)
const INDEXNOW_ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
  "https://yandex.com/indexnow",
];

export interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

export interface IndexNowSubmissionResult {
  endpoint: string;
  success: boolean;
  status: number;
  message: string;
}

/**
 * Get all public indexable URLs for PixPassport.
 */
export function getAllSiteUrls(): string[] {
  const baseUrl = `https://${INDEXNOW_HOST}`;
  const staticPages = [
    baseUrl,
    `${baseUrl}/passport-size-photo-maker`,
    `${baseUrl}/passport-photo-print-template-generator`,
    `${baseUrl}/about-us`,
    `${baseUrl}/contact-us`,
    `${baseUrl}/data-security-privacy-safeguards`,
    `${baseUrl}/privacy-policy`,
    `${baseUrl}/terms-of-service`,
    `${baseUrl}/refund-policy`,
  ];

  const toolPages = getAllToolSlugs().map((slug) => `${baseUrl}/tool/${slug}`);

  return Array.from(new Set([...staticPages, ...toolPages]));
}

/**
 * Submit a batch of URLs to the IndexNow protocol.
 */
export async function submitUrlsToIndexNow(
  urls: string | string[],
  endpoint: string = INDEXNOW_ENDPOINTS[0]
): Promise<IndexNowSubmissionResult> {
  const urlList = (Array.isArray(urls) ? urls : [urls])
    .map((u) => u.trim())
    .filter(Boolean);

  if (urlList.length === 0) {
    return {
      endpoint,
      success: false,
      status: 400,
      message: "No valid URLs provided for IndexNow submission.",
    };
  }

  const payload: IndexNowPayload = {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList,
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    const status = response.status;
    let message = "URL submitted successfully";

    if (status === 200 || status === 202) {
      message = `IndexNow accepted ${urlList.length} URL(s) successfully (HTTP ${status}).`;
    } else if (status === 400) {
      message = "IndexNow 400: Invalid payload or request format.";
    } else if (status === 403) {
      message = "IndexNow 403: Key is not valid or key file not found at keyLocation.";
    } else if (status === 422) {
      message = "IndexNow 422: URLs don't belong to the host or key doesn't match schema.";
    } else if (status === 429) {
      message = "IndexNow 429: Rate limited / too many requests.";
    } else {
      message = `IndexNow returned status ${status}`;
    }

    return {
      endpoint,
      success: status === 200 || status === 202,
      status,
      message,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      endpoint,
      success: false,
      status: 500,
      message: `Failed to submit to IndexNow: ${errorMsg}`,
    };
  }
}

/**
 * Submit all website pages to IndexNow in one batch.
 */
export async function submitAllPagesToIndexNow(): Promise<{
  totalUrls: number;
  results: IndexNowSubmissionResult[];
}> {
  const allUrls = getAllSiteUrls();
  const results: IndexNowSubmissionResult[] = [];

  // Submit to primary endpoint (IndexNow automatically shares with Bing, Yandex, etc.)
  const primaryResult = await submitUrlsToIndexNow(allUrls, INDEXNOW_ENDPOINTS[0]);
  results.push(primaryResult);

  // If primary returned an issue or for extra redundancy, also notify Bing directly
  if (!primaryResult.success) {
    const bingResult = await submitUrlsToIndexNow(allUrls, INDEXNOW_ENDPOINTS[1]);
    results.push(bingResult);
  }

  return {
    totalUrls: allUrls.length,
    results,
  };
}
