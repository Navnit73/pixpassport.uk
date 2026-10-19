/**
 * Pricing configuration.
 * Price points per currency live in src/lib/currency.ts; the charged currency is
 * resolved server-side from the visitor's geo-IP country.
 * Never accept payment amounts directly from client-side input — always derive from here.
 */

import {
  BASE_CURRENCY,
  CURRENCIES,
  formatMoney,
  getPriceInMinorUnits,
  type CurrencyCode,
  type PlanType,
} from "@/lib/currency";

export type { PlanType };

const baseAmountInSubunits = getPriceInMinorUnits(BASE_CURRENCY, "standard");
const baseExpertAmountInSubunits = getPriceInMinorUnits(BASE_CURRENCY, "expert_edit");

export const PRICING = {
  /** Standard Pack amount in base currency units (e.g. 7.99 GBP) */
  amount: baseAmountInSubunits / 100,
  /** Amount in smallest currency unit (pence/paise/cents) for Razorpay */
  amountInPence: baseAmountInSubunits,
  amountInSubunits: baseAmountInSubunits,

  /** Expert Edit amount in base currency units (e.g. 13.99 GBP) */
  expertEditAmount: baseExpertAmountInSubunits / 100,
  expertEditAmountInPence: baseExpertAmountInSubunits,
  expertEditAmountInSubunits: baseExpertAmountInSubunits,

  /** Base (fallback) ISO 4217 currency code */
  currency: BASE_CURRENCY,
  /** Human-readable base currency symbol */
  currencySymbol: CURRENCIES[BASE_CURRENCY].symbol,
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
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "support@pixpassport.com",
  /** Website URL */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://pixpassport.uk",
} as const;

export type PlanPricing = ReturnType<typeof getPlanPricing>;

export function getPlanPricing(plan: PlanType = "standard", currency: CurrencyCode = BASE_CURRENCY) {
  const isExpert = plan === "expert_edit";
  const def = CURRENCIES[currency];
  const planSubunits = getPriceInMinorUnits(currency, plan);

  return {
    planType: plan,
    title: isExpert ? "Expert Edit & Review" : "Standard Photo",
    amount: planSubunits / 10 ** def.exponent,
    amountFormatted: formatMoney(planSubunits, currency, { trimWholeNumbers: true }),
    amountInSubunits: planSubunits,
    currency,
    currencySymbol: def.symbol,
    description: isExpert
      ? "AI-processed photo + 100% human expert manual inspection, touchups & guaranteed government acceptance."
      : "AI-processed, government-compliant biometric passport photo with instant download & print sheet.",
  };
}

export type PricingConfig = typeof PRICING;
