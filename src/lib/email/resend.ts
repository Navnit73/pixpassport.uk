/**
 * Resend Email Client & Global Email Defaults
 */

import { Resend } from "resend";

let _instance: Resend | null = null;

export function getResendClient(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured.");
  }
  if (!_instance) {
    _instance = new Resend(process.env.RESEND_API_KEY);
  }
  return _instance;
}

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "PixPassport <photo@pixpassport.uk>";

export const REPLY_TO_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "support@pixpassport.com";

export const BCC_EMAILS: string[] = process.env.RESEND_BCC_EMAIL
  ? process.env.RESEND_BCC_EMAIL.split(",").map((s) => s.trim()).filter(Boolean)
  : ["usvisaphotoai@gmail.com"];
