/**
 * Pricing configuration.
 * Automatically configured via environment variables for testing/production.
 * Never accept payment amounts directly from client-side input — always derive from here.
 */

const currency = (process.env.NEXT_PUBLIC_PAYMENT_CURRENCY || "GBP").toUpperCase();

const currencySymbols: Record<string, string> = {
  GBP: "£",
  INR: "₹",
  USD: "$",
  EUR: "€",
  CAD: "CA$",
  AUD: "A$",
};

const defaultAmounts: Record<string, number> = {
  GBP: 7.99,
  INR: 1.00, // ₹1.00 for testing Razorpay UPI/Netbanking/Cards
  USD: 9.99,
  EUR: 8.99,
};

const parsedAmount = process.env.NEXT_PUBLIC_PAYMENT_AMOUNT
  ? parseFloat(process.env.NEXT_PUBLIC_PAYMENT_AMOUNT)
  : (defaultAmounts[currency] ?? 7.99);

const amount = isNaN(parsedAmount) || parsedAmount <= 0 ? (defaultAmounts[currency] ?? 7.99) : parsedAmount;
const amountInSubunits = Math.round(amount * 100);

export const PRICING = {
  /** Amount in standard currency units (e.g. 7.99 GBP or 1.00 INR) */
  amount,
  /** Amount in smallest currency unit (pence/paise/cents) for Razorpay */
  amountInPence: amountInSubunits,
  amountInSubunits,
  /** ISO 4217 currency code */
  currency,
  /** Human-readable currency symbol */
  currencySymbol: currencySymbols[currency] || (currency === "INR" ? "₹" : "£"),
  /** Product identifier */
  productType: "digital_passport_photo",
  /** Product display name */
  productName: "Official Biometric Passport Photo",
  /** Product description */
  productDescription:
    "AI-processed, government-compliant biometric passport photo with background removal, auto-crop, and print-ready 6×4″ sheet.",
  /** Business display name */
  businessName: "PixPassport",
  /** Support email */
  supportEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "support@pixpassport.uk",
  /** Website URL */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://pixpassport.uk",
} as const;

export type PricingConfig = typeof PRICING;
