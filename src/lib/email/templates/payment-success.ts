/**
 * Payment success + image delivery email template
 */

import { baseEmailTemplate, escapeHtml } from "./base";
import { PRICING } from "@/lib/config/pricing";

export function paymentSuccessEmail(params: {
  email: string;
  paymentId: string;
  razorpayPaymentId: string;
  amount: number;
  currency: string;
  invoiceNumber: string;
  downloadUrl: string;
  invoiceUrl: string;
  invoicePdfUrl?: string;
  countryName?: string;
  dimensions?: string;
}): { subject: string; html: string } {
  const currencySymbols: Record<string, string> = {
    GBP: "£",
    INR: "₹",
    USD: "$",
    EUR: "€",
    CAD: "CA$",
    AUD: "A$",
  };
  const symbol = currencySymbols[params.currency?.toUpperCase()] || "";
  const amountFormatted = symbol
    ? `${symbol}${(params.amount / 100).toFixed(2)}`
    : `${(params.amount / 100).toFixed(2)} ${params.currency}`;

  const subject = `Your Passport Photo is Ready — ${escapeHtml(PRICING.businessName)}`;

  const bodyHtml = `
    <!-- Success Icon -->
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background-color:#f0fdf4;line-height:56px;font-size:28px;">
        ✅
      </div>
    </div>

    <h2 style="color:#0f172a;font-size:22px;font-weight:800;text-align:center;margin:0 0 8px;letter-spacing:-0.5px;">
      Payment Confirmed!
    </h2>
    <p style="color:#64748b;font-size:14px;text-align:center;margin:0 0 28px;">
      Your biometric passport photo is ready for download.
    </p>

    <!-- Order Details -->
    <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:20px;margin-bottom:24px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
        <tr>
          <td style="padding:6px 0;color:#64748b;">Product</td>
          <td style="padding:6px 0;color:#0f172a;font-weight:600;text-align:right;">${escapeHtml(PRICING.productName)}</td>
        </tr>
        ${params.countryName ? `<tr>
          <td style="padding:6px 0;color:#64748b;">Country</td>
          <td style="padding:6px 0;color:#0f172a;font-weight:600;text-align:right;">${escapeHtml(params.countryName)}</td>
        </tr>` : ""}
        ${params.dimensions ? `<tr>
          <td style="padding:6px 0;color:#64748b;">Dimensions</td>
          <td style="padding:6px 0;color:#0f172a;font-weight:600;text-align:right;">${escapeHtml(params.dimensions)}</td>
        </tr>` : ""}
        <tr>
          <td style="padding:6px 0;color:#64748b;">Amount Paid</td>
          <td style="padding:6px 0;color:#0f172a;font-weight:700;text-align:right;font-size:16px;">${escapeHtml(amountFormatted)}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#64748b;">Invoice</td>
          <td style="padding:6px 0;color:#0f172a;font-weight:600;text-align:right;">#${escapeHtml(params.invoiceNumber)}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#64748b;">Payment Ref</td>
          <td style="padding:6px 0;color:#0f172a;font-weight:600;text-align:right;font-family:monospace;font-size:12px;">${escapeHtml(params.razorpayPaymentId)}</td>
        </tr>
      </table>
    </div>

    <!-- Download CTA -->
    <div style="text-align:center;margin-bottom:16px;">
      <a href="${escapeHtml(params.downloadUrl)}" style="display:inline-block;padding:14px 32px;background-color:#4d7c0f;color:#ffffff !important;text-decoration:none;border-radius:10px;font-weight:700;font-size:15px;">
        ⬇️ Download Your Photo
      </a>
    </div>

    <p style="text-align:center;font-size:12px;color:#94a3b8;margin-bottom:24px;">
      This download link expires in 72 hours.
    </p>

    <!-- Invoice PDF Attachment Box -->
    <div style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px 16px;margin-bottom:24px;text-align:center;font-size:13px;color:#166534;">
      📄 <strong>Official Tax Invoice Attached:</strong><br/>
      We have attached <strong>Invoice-${escapeHtml(params.invoiceNumber)}.pdf</strong> to this email.
      ${params.invoicePdfUrl ? `<br/><a href="${escapeHtml(params.invoicePdfUrl)}" target="_blank" style="display:inline-block;margin-top:8px;color:#15803d;font-weight:700;text-decoration:underline;">View Cloud Hosted Invoice PDF &rarr;</a>` : ""}
    </div>

    <hr style="border:0;border-top:1px solid #e2e8f0;margin:24px 0;"/>

    <!-- Invoice Link -->
    <div style="text-align:center;margin-bottom:24px;">
      <a href="${escapeHtml(params.invoiceUrl)}" style="color:#4d7c0f;font-weight:600;font-size:13px;text-decoration:underline;">
        View Interactive Web Invoice #${escapeHtml(params.invoiceNumber)}
      </a>
    </div>

    <!-- Support -->
    <div style="background-color:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:16px;font-size:13px;color:#92400e;">
      <strong>Need help?</strong> Reply to this email or visit
      <a href="${escapeHtml(PRICING.siteUrl)}/contact-us" style="color:#4d7c0f;text-decoration:underline;">our support page</a>.
      We offer a full refund if your photo is rejected by any government agency.
    </div>
  `;

  return {
    subject,
    html: baseEmailTemplate({
      preheader: `Your ${params.countryName || ""} passport photo is ready for download — ${amountFormatted} paid.`,
      bodyHtml,
    }),
  };
}
