/**
 * Currency & Geo Pricing Module
 *
 * Single source of truth for:
 *  - Which Razorpay currencies we accept and their price points
 *  - Mapping a visitor's country (from CDN geo-IP headers) to a currency
 *  - Formatting money amounts consistently across UI, emails and invoices
 *
 * Prices are hand-set localized price points stored as integer minor units
 * (pence/cents/paise) — never converted from FX rates at runtime, so the price a
 * customer sees is exactly the price Razorpay charges, with no float rounding.
 *
 * This module is isomorphic (no Node APIs) so client components can format money.
 */

export type PlanType = "standard" | "expert_edit";

export interface CurrencyDefinition {
  code: string;
  /** Display symbol, unambiguous across dollar currencies (e.g. "CA$") */
  symbol: string;
  /** Number of minor-unit digits (Razorpay expects amounts in minor units) */
  exponent: number;
  /** Plan prices in minor units */
  prices: Record<PlanType, number>;
  /**
   * PayPal (via Razorpay International) can settle this currency. PayPal does not
   * support AED, and Razorpay does not offer PayPal on INR orders.
   */
  paypal: boolean;
}

/**
 * Supported Razorpay currencies. All are 2-decimal currencies supported by
 * Razorpay International Payments. Add a currency here, then map countries to it
 * in COUNTRY_CURRENCY below.
 */
export const CURRENCIES = {
  GBP: { code: "GBP", symbol: "£", exponent: 2, prices: { standard: 799, expert_edit: 1399 }, paypal: true },
  USD: { code: "USD", symbol: "$", exponent: 2, prices: { standard: 999, expert_edit: 1699 }, paypal: true },
  EUR: { code: "EUR", symbol: "€", exponent: 2, prices: { standard: 899, expert_edit: 1599 }, paypal: true },
  CAD: { code: "CAD", symbol: "CA$", exponent: 2, prices: { standard: 1399, expert_edit: 2399 }, paypal: true },
  AUD: { code: "AUD", symbol: "A$", exponent: 2, prices: { standard: 1499, expert_edit: 2599 }, paypal: true },
  NZD: { code: "NZD", symbol: "NZ$", exponent: 2, prices: { standard: 1699, expert_edit: 2899 }, paypal: true },
  SGD: { code: "SGD", symbol: "S$", exponent: 2, prices: { standard: 1299, expert_edit: 2299 }, paypal: true },
  HKD: { code: "HKD", symbol: "HK$", exponent: 2, prices: { standard: 7900, expert_edit: 12900 }, paypal: true },
  CHF: { code: "CHF", symbol: "CHF ", exponent: 2, prices: { standard: 899, expert_edit: 1499 }, paypal: true },
  AED: { code: "AED", symbol: "AED ", exponent: 2, prices: { standard: 3699, expert_edit: 6299 }, paypal: false },
  INR: { code: "INR", symbol: "₹", exponent: 2, prices: { standard: 49900, expert_edit: 89900 }, paypal: false },
} as const satisfies Record<string, CurrencyDefinition>;

export type CurrencyCode = keyof typeof CURRENCIES;

/** Exact-match check — callers must upper-case user/env input first. */
export function isSupportedCurrency(code: string | null | undefined): code is CurrencyCode {
  return !!code && Object.prototype.hasOwnProperty.call(CURRENCIES, code);
}

/**
 * Fallback currency (site is UK-first): used when the country is unknown, has no
 * dedicated currency mapping, or its currency isn't enabled on the Razorpay account.
 * Always GBP unless NEXT_PUBLIC_PAYMENT_CURRENCY is set (e.g. INR for test payments).
 */
export const BASE_CURRENCY: CurrencyCode = (() => {
  const env = (process.env.NEXT_PUBLIC_PAYMENT_CURRENCY || "GBP").toUpperCase();
  return isSupportedCurrency(env) ? env : "GBP";
})();

// ---------------------------------------------------------------------------
// Country → currency mapping (ISO 3166-1 alpha-2)
// ---------------------------------------------------------------------------

const GBP_COUNTRIES = ["GB", "IM", "JE", "GG", "GI", "FK", "SH"];

/** US, its territories, and dollarized economies. */
const USD_COUNTRIES = [
  "US", "PR", "GU", "VI", "AS", "MP", "UM",
  "EC", "SV", "PA", "TL", "FM", "MH", "PW", "BQ", "TC", "VG",
];

/**
 * All EU member states (incl. non-euro members, which are billed in EUR),
 * EEA members, euro-using microstates and euro-using overseas territories.
 */
const EUR_COUNTRIES = [
  // Eurozone (Bulgaria joined 1 Jan 2026)
  "AT", "BE", "BG", "HR", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT",
  "LV", "LT", "LU", "MT", "NL", "PT", "SK", "SI", "ES",
  // EU members outside the eurozone
  "CZ", "DK", "HU", "PL", "RO", "SE",
  // EEA (non-EU) — Liechtenstein uses CHF
  "IS", "NO",
  // Euro-using microstates & others
  "AD", "MC", "SM", "VA", "ME", "XK",
  // Euro-using territories
  "AX", "GF", "GP", "MQ", "RE", "YT", "PM", "BL", "MF",
];

const COUNTRY_CURRENCY: Record<string, CurrencyCode> = {
  ...Object.fromEntries(GBP_COUNTRIES.map((c) => [c, "GBP" as const])),
  ...Object.fromEntries(USD_COUNTRIES.map((c) => [c, "USD" as const])),
  ...Object.fromEntries(EUR_COUNTRIES.map((c) => [c, "EUR" as const])),
  CA: "CAD",
  AU: "AUD",
  NZ: "NZD",
  SG: "SGD",
  HK: "HKD",
  CH: "CHF",
  LI: "CHF",
  AE: "AED",
  IN: "INR",
};

// ---------------------------------------------------------------------------
// Runtime configuration (server env)
// ---------------------------------------------------------------------------

/**
 * Currencies enabled on the Razorpay account. Comma-separated
 * PAYMENT_ENABLED_CURRENCIES (e.g. "GBP,USD,EUR"); defaults to all supported.
 * The base currency is always enabled.
 */
function getEnabledCurrencies(): Set<CurrencyCode> {
  const raw = process.env.PAYMENT_ENABLED_CURRENCIES;
  const list = raw
    ? raw.split(",").map((s) => s.trim().toUpperCase()).filter(isSupportedCurrency)
    : (Object.keys(CURRENCIES) as CurrencyCode[]);
  return new Set<CurrencyCode>([...list, BASE_CURRENCY]);
}

function isGeoPricingEnabled(): boolean {
  return process.env.GEO_PRICING_ENABLED !== "false";
}

// ---------------------------------------------------------------------------
// Geo detection
// ---------------------------------------------------------------------------

/** Placeholder codes CDNs return for unknown, Tor, anonymous proxy, satellite, etc. */
const NON_COUNTRY_CODES = new Set(["XX", "T1", "A1", "A2", "O1", "EU", "AP", "ZZ"]);

interface HeaderSource {
  get(name: string): string | null;
}

export function normalizeCountryCode(value: string | null | undefined): string | null {
  if (!value) return null;
  const code = value.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code) || NON_COUNTRY_CODES.has(code)) return null;
  return code;
}

/**
 * Cloudflare edge IP ranges (https://www.cloudflare.com/ips/). Requests from these
 * IPs came through our Cloudflare proxy, so their cf-ipcountry header is genuine
 * (Cloudflare strips any client-supplied cf-* headers).
 */
const CLOUDFLARE_IPV4_RANGES = [
  "173.245.48.0/20", "103.21.244.0/22", "103.22.200.0/22", "103.31.4.0/22",
  "141.101.64.0/18", "108.162.192.0/18", "190.93.240.0/20", "188.114.96.0/20",
  "197.234.240.0/22", "198.41.128.0/17", "162.158.0.0/15", "104.16.0.0/13",
  "104.24.0.0/14", "172.64.0.0/13", "131.0.72.0/22",
];
const CLOUDFLARE_IPV6_RANGES = [
  "2400:cb00::/32", "2606:4700::/32", "2803:f800::/32", "2405:b500::/32",
  "2405:8100::/32", "2a06:98c0::/29", "2c0f:f248::/32",
];

function parseIPv4(ip: string): number | null {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  let value = 0;
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return null;
    const n = Number(part);
    if (n > 255) return null;
    value = value * 256 + n;
  }
  return value;
}

function parseIPv6(ip: string): bigint | null {
  if (!/^[0-9a-f:]+$/i.test(ip)) return null;
  const halves = ip.split("::");
  if (halves.length > 2) return null;
  const head = halves[0] ? halves[0].split(":") : [];
  const tail = halves.length === 2 && halves[1] ? halves[1].split(":") : [];
  const missing = 8 - head.length - tail.length;
  if (halves.length === 1 ? missing !== 0 : missing < 1) return null;
  const groups = [...head, ...Array(Math.max(missing, 0)).fill("0"), ...tail];
  let value = BigInt(0);
  for (const g of groups) {
    if (!/^[0-9a-f]{1,4}$/i.test(g)) return null;
    value = (value << BigInt(16)) + BigInt(parseInt(g, 16));
  }
  return value;
}

function isInRanges(ip: string, v4Ranges: string[], v6Ranges: string[]): boolean {
  let addr = ip.trim().replace(/^\[|\]$/g, "");
  // IPv4-mapped IPv6 (::ffff:1.2.3.4)
  const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/i.exec(addr);
  if (mapped) addr = mapped[1];

  const v4 = parseIPv4(addr);
  if (v4 !== null) {
    return v4Ranges.some((cidr) => {
      const [base, bits] = cidr.split("/");
      const baseValue = parseIPv4(base)!;
      const size = 2 ** (32 - Number(bits));
      return Math.floor(v4 / size) === Math.floor(baseValue / size);
    });
  }

  const v6 = parseIPv6(addr);
  if (v6 === null) return false;
  return v6Ranges.some((cidr) => {
    const [base, bits] = cidr.split("/");
    const shift = BigInt(128 - Number(bits));
    return v6 >> shift === parseIPv6(base)! >> shift;
  });
}

export function isCloudflareIp(ip: string | null | undefined): boolean {
  return !!ip && isInRanges(ip, CLOUDFLARE_IPV4_RANGES, CLOUDFLARE_IPV6_RANGES);
}

/**
 * Detect the visitor's country from edge geo-IP headers, trusting only headers
 * the edge itself set — a forged header must never pick a cheaper regional price.
 *
 *  - On Vercel, x-real-ip is always overwritten by Vercel with the connecting IP.
 *    If that IP is Cloudflare's, the request was proxied by Cloudflare: use
 *    cf-ipcountry (x-vercel-ip-country would only be the Cloudflare PoP's country).
 *    Otherwise the visitor hit Vercel directly: use x-vercel-ip-country and ignore
 *    any cf-ipcountry, which the client could have forged.
 *  - Off Vercel (local/self-hosted), GEO_IP_HEADER names the one trusted header
 *    (default cf-ipcountry).
 *
 * GEO_COUNTRY_OVERRIDE (non-production only) forces a country for local testing.
 */
export function detectCountry(headers: HeaderSource): string | null {
  if (process.env.NODE_ENV !== "production") {
    const override = normalizeCountryCode(process.env.GEO_COUNTRY_OVERRIDE);
    if (override) return override;
  }

  if (process.env.VERCEL) {
    const connectingIp = headers.get("x-real-ip");
    if (isCloudflareIp(connectingIp)) {
      const cfCountry = headers.get("cf-ipcountry");
      // Header present but a placeholder (Tor/unknown) → unknown, not the PoP country
      if (cfCountry !== null) return normalizeCountryCode(cfCountry);
    }
    return normalizeCountryCode(headers.get("x-vercel-ip-country"));
  }

  const header = process.env.GEO_IP_HEADER?.trim().toLowerCase() || "cf-ipcountry";
  return normalizeCountryCode(headers.get(header));
}

export function getCurrencyForCountry(country: string | null): CurrencyCode {
  if (!isGeoPricingEnabled() || !country) return BASE_CURRENCY;

  const mapped = COUNTRY_CURRENCY[country];
  return mapped && getEnabledCurrencies().has(mapped) ? mapped : BASE_CURRENCY;
}

export function resolveCurrencyFromHeaders(headers: HeaderSource): {
  country: string | null;
  currency: CurrencyCode;
} {
  const country = detectCountry(headers);
  return { country, currency: getCurrencyForCountry(country) };
}

// ---------------------------------------------------------------------------
// Prices & formatting
// ---------------------------------------------------------------------------

/**
 * Plan price in minor units. Legacy env overrides (NEXT_PUBLIC_PAYMENT_AMOUNT,
 * NEXT_PUBLIC_EXPERT_EDIT_AMOUNT) apply to the base currency only — useful for
 * low-value Razorpay test payments.
 */
export function getPriceInMinorUnits(currency: CurrencyCode, plan: PlanType): number {
  const def = CURRENCIES[currency];
  if (currency === BASE_CURRENCY) {
    const raw =
      plan === "expert_edit"
        ? process.env.NEXT_PUBLIC_EXPERT_EDIT_AMOUNT
        : process.env.NEXT_PUBLIC_PAYMENT_AMOUNT;
    const parsed = raw ? parseFloat(raw) : NaN;
    if (!isNaN(parsed) && parsed > 0) {
      return Math.round(parsed * 10 ** def.exponent);
    }
  }
  return def.prices[plan];
}

/**
 * Whether customers paying in this currency can choose PayPal at checkout.
 * PayPal must also be activated in Razorpay Dashboard → International Payments;
 * set NEXT_PUBLIC_PAYPAL_ENABLED=false to hide it.
 */
export function supportsPayPal(currency: string): boolean {
  if (process.env.NEXT_PUBLIC_PAYPAL_ENABLED === "false") return false;
  const code = currency?.toUpperCase();
  return isSupportedCurrency(code) && CURRENCIES[code].paypal;
}

export function getCurrencySymbol(currency: string): string {
  const code = currency?.toUpperCase();
  return isSupportedCurrency(code) ? CURRENCIES[code].symbol : `${code} `;
}

/**
 * Format a minor-unit amount, e.g. formatMoney(799, "GBP") → "£7.99".
 * Whole amounts drop the decimals when trimWholeNumbers is set (₹499, HK$79).
 */
export function formatMoney(
  minorUnits: number,
  currency: string,
  { trimWholeNumbers = false }: { trimWholeNumbers?: boolean } = {}
): string {
  const code = (currency || BASE_CURRENCY).toUpperCase();
  const exponent = isSupportedCurrency(code) ? CURRENCIES[code].exponent : 2;
  const major = minorUnits / 10 ** exponent;
  const isWhole = minorUnits % 10 ** exponent === 0;
  const digits = trimWholeNumbers && isWhole ? 0 : exponent;

  const number = new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(major);

  return `${getCurrencySymbol(code)}${number}`;
}
