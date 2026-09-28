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

const defaultExpertAmounts: Record<string, number> = {
  GBP: 13.99,
  INR: 2.00, // ₹2.00 for testing Razorpay UPI/Netbanking/Cards in INR
  USD: 16.99,
  EUR: 15.99,
};

const parsedAmount = process.env.NEXT_PUBLIC_PAYMENT_AMOUNT
  ? parseFloat(process.env.NEXT_PUBLIC_PAYMENT_AMOUNT)
  : (defaultAmounts[currency] ?? 7.99);

const amount = isNaN(parsedAmount) || parsedAmount <= 0 ? (defaultAmounts[currency] ?? 7.99) : parsedAmount;
const amountInSubunits = Math.round(amount * 100);

// Expert Edit pricing (£13.99 for GBP, or ₹2 for test mode)
const parsedExpertAmount = process.env.NEXT_PUBLIC_EXPERT_EDIT_AMOUNT
  ? parseFloat(process.env.NEXT_PUBLIC_EXPERT_EDIT_AMOUNT)
  : (defaultExpertAmounts[currency] ?? (currency === "INR" ? 2.00 : 13.99));

const expertEditAmount =
  isNaN(parsedExpertAmount) || parsedExpertAmount <= 0
    ? (defaultExpertAmounts[currency] ?? (currency === "INR" ? 2.00 : 13.99))
    : parsedExpertAmount;

const expertEditAmountInSubunits = Math.round(expertEditAmount * 100);

export const PRICING = {
  /** Standard Pack amount in standard currency units (e.g. 7.99 GBP or 1.00 INR) */
  amount,
  /** Amount in smallest currency unit (pence/paise/cents) for Razorpay */
  amountInPence: amountInSubunits,
  amountInSubunits,

  /** Expert Edit amount in standard currency units (e.g. 13.99 GBP or 2.00 INR) */
  expertEditAmount,
  expertEditAmountInPence: expertEditAmountInSubunits,
  expertEditAmountInSubunits,

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

export type PlanType = "standard" | "expert_edit";

export function getPlanPricing(plan: PlanType = "standard") {
  const isExpert = plan === "expert_edit";
  const planAmount = isExpert ? PRICING.expertEditAmount : PRICING.amount;
  const planSubunits = isExpert ? PRICING.expertEditAmountInSubunits : PRICING.amountInSubunits;

  return {
    planType: plan,
    title: isExpert ? "Expert Edit & Review" : "Standard Photo",
    amount: planAmount,
    amountFormatted: `${PRICING.currencySymbol}${Number.isInteger(planAmount) ? planAmount : planAmount.toFixed(2)}`,
    amountInSubunits: planSubunits,
    currency: PRICING.currency,
    currencySymbol: PRICING.currencySymbol,
    description: isExpert
      ? "AI-processed photo + 100% human expert manual inspection, touchups & guaranteed government acceptance."
      : "AI-processed, government-compliant biometric passport photo with instant download & print sheet.",
  };
}

export type PricingConfig = typeof PRICING;
