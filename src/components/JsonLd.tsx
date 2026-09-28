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
  appName?: string;
  appUrl?: string;
  appId?: string;
  applicationCategory?: string;
  price?: string;
  priceCurrency?: string;
  faqItems?: JsonLdFaqEntry[];
  breadcrumbs?: Array<{ name: string; url: string }>;
  includeOrganization?: boolean;
  includeWebsite?: boolean;
  includeWebApp?: boolean;
}

const DEFAULT_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pixpassport.uk";

/**
 * Returns JSON-LD structured data for Google Search & SEO rich results.
 * Strictly adheres to Google Search Central guidelines:
 * - Only emits FAQPage schema if matching visible FAQs are supplied on the page.
 * - Emits valid Organization, WebSite, and WebApplication schemas.
 */
export default function JsonLd({
  siteUrl = DEFAULT_SITE_URL,
  siteName = "PixPassport",
  description = "Create a digital photo for passport applications and renewals online. Official UK passport photo maker for £7.99.",
  logoUrl = `${DEFAULT_SITE_URL}/pixpassport.jpg`,
  imageUrl = `${DEFAULT_SITE_URL}/pixpassport.jpg`,
  appName,
  appUrl,
  appId,
  applicationCategory = "PhotographyApplication",
  price = "7.99",
  priceCurrency = "GBP",
  faqItems,
  breadcrumbs,
  includeOrganization = true,
  includeWebsite = true,
  includeWebApp = true,
}: JsonLdProps) {
  const graph: object[] = [];

  if (includeOrganization) {
    graph.push({
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: logoUrl,
        width: 512,
        height: 512,
      },
      image: imageUrl,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "support@pixpassport.uk",
        areaServed: "GB",
        availableLanguage: ["English"],
      },
    });
  }

  if (includeWebsite) {
    graph.push({
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      description: description,
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "en-GB",
    });
  }

  if (includeWebApp) {
    const resolvedAppUrl = appUrl || `${siteUrl}/passport-size-photo-maker`;
    const resolvedAppId = appId || `${siteUrl}/#webapp`;
    const resolvedAppName = appName || `${siteName} Passport Photo Maker`;

    graph.push({
      "@type": "WebApplication",
      "@id": resolvedAppId,
      name: resolvedAppName,
      url: resolvedAppUrl,
      description: description,
      applicationCategory: applicationCategory,
      operatingSystem: "All",
      browserRequirements:
        "Requires a modern web browser with JavaScript enabled",
      offers: {
        "@type": "Offer",
        price: price,
        priceCurrency: priceCurrency,
        priceValidUntil: "2027-12-31",
        availability: "https://schema.org/InStock",
      },
      provider: { "@id": `${siteUrl}/#organization` },
      inLanguage: "en-GB",
    });
  }

  if (faqItems && faqItems.length > 0) {
    graph.push({
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
    });
  }

  if (breadcrumbs && breadcrumbs.length > 0) {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((crumb, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    });
  }

  const graphData = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graphData) }}
    />
  );
}
