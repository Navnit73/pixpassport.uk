"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { getPlanPricing, type PlanPricing } from "@/lib/config/pricing";
import { BASE_CURRENCY, isSupportedCurrency, type CurrencyCode } from "@/lib/currency";

export interface PricingContextValue {
  currency: CurrencyCode;
  country: string | null;
  standard: PlanPricing;
  expert_edit: PlanPricing;
  /** Update the displayed currency (e.g. after the server reports a regional price change) */
  setCurrency: (currency: string) => void;
}

export interface PricingProviderProps {
  /** Currency resolved server-side from the visitor's geo-IP country */
  initialCurrency: CurrencyCode;
  country: string | null;
  children: React.ReactNode;
}

const PricingContext = createContext<PricingContextValue | null>(null);

export default function PricingProvider({ initialCurrency, country, children }: PricingProviderProps) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(initialCurrency);

  const value = useMemo<PricingContextValue>(
    () => ({
      currency,
      country,
      standard: getPlanPricing("standard", currency),
      expert_edit: getPlanPricing("expert_edit", currency),
      setCurrency: (next: string) => {
        const code = next?.toUpperCase();
        if (isSupportedCurrency(code)) setCurrencyState(code);
      },
    }),
    [currency, country]
  );

  return <PricingContext.Provider value={value}>{children}</PricingContext.Provider>;
}

/** Geo-resolved plan pricing. Falls back to base-currency pricing outside a provider. */
export function usePricing(): PricingContextValue {
  const ctx = useContext(PricingContext);
  return (
    ctx ?? {
      currency: BASE_CURRENCY,
      country: null,
      standard: getPlanPricing("standard", BASE_CURRENCY),
      expert_edit: getPlanPricing("expert_edit", BASE_CURRENCY),
      setCurrency: () => {},
    }
  );
}
