import type { Metadata } from "next";
import { headers } from "next/headers";
import PricingProvider from "@/components/PricingProvider";
import { resolveCurrencyFromHeaders } from "@/lib/currency";

export const metadata: Metadata = {
  title: "Photo Preview & Biometric Verification Result",
  description:
    "Preview and download your verified passport photo result and printable sheet.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default async function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currency, country } = resolveCurrencyFromHeaders(await headers());

  return (
    <PricingProvider initialCurrency={currency} country={country}>
      {children}
    </PricingProvider>
  );
}
