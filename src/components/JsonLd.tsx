import { DEFAULT_FAQS } from "./FAQ";

export interface JsonLdFaqEntry {
  question: string;
  answer: string;
}

export interface JsonLdProps {
  siteUrl?: string;
  siteName?: string;
  description?: string;
  logoUrl?: string;
  imageUrl?: string;
  applicationCategory?: string;
  price?: string;
  priceCurrency?: string;
  faqItems?: JsonLdFaqEntry[];
}

const DEFAULT_SITE_URL = "https://pixpassport.uk";

/**
 * Returns JSON-LD structured data for SEO indexing.
 *
 * Includes: Organization, WebSite, WebApplication, FAQPage.
 * Fully configurable via props with verified UK-focused defaults.
 */
export default function JsonLd({
  siteUrl = DEFAULT_SITE_URL,
  siteName = "PixPassport",
  description = "Create a digital photo for passport applications and renewals online. Free UK passport photo maker.",
  logoUrl = `${DEFAULT_SITE_URL}/pixpassport.jpg`,
  imageUrl = `${DEFAULT_SITE_URL}/pixpassport.jpg`,
  applicationCategory = "PhotographyApplication",
  price = "0",
  priceCurrency = "GBP",
  faqItems = DEFAULT_FAQS.map((faq) => ({
    question: faq.question,
    answer: typeof faq.answer === "string" ? faq.answer : "",
  })),
}: JsonLdProps) {
  const organization = {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: siteName,
    url: siteUrl,
    logo: logoUrl,
    image: imageUrl,
  };

  const website = {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: siteName,
    description: description,
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage: "en-GB",
  };

  const webApplication = {
    "@type": "WebApplication",
    "@id": `${siteUrl}/#webapp`,
    name: siteName,
    url: siteUrl,
    description: `Free online UK passport photo maker. Upload a photo, adjust to 35mm × 45mm, and download a print-ready digital photo for passport applications and renewals.`,
    applicationCategory: applicationCategory,
    operatingSystem: "All",
    browserRequirements: "Requires a modern web browser with JavaScript enabled",
    offers: {
      "@type": "Offer",
      price: price,
      priceCurrency: priceCurrency,
    },
    provider: { "@id": `${siteUrl}/#organization` },
    inLanguage: "en-GB",
  };

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${siteUrl}/#faq`,
    mainEntity: faqItems.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };

  const graphData = {
    "@context": "https://schema.org",
    "@graph": [organization, website, webApplication, faqPage],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graphData) }}
    />
  );
}
