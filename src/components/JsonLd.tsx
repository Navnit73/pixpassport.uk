export interface JsonLdFaqEntry {
  question: string;
  answer: string;
}

export interface JsonLdHowTo {
  name: string;
  description?: string;
  /** ISO 8601 duration, e.g. "PT10M". */
  totalTime?: string;
  imageUrl?: string;
  steps: Array<{ name: string; text: string }>;
}

export interface JsonLdArticle {
  headline: string;
  description?: string;
  imageUrl?: string;
  /** ISO 8601 date, e.g. "2026-10-24". */
  datePublished?: string;
  dateModified?: string;
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
  /** Absolute URL of the page the FAQs and breadcrumbs belong to. */
  pageUrl?: string;
  /** Emits a WebPage node for `pageUrl` when set. */
  pageName?: string;
  pageDescription?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  /** Emits a HowTo node for `pageUrl`. Steps must match the steps visible on the page. */
  howTo?: JsonLdHowTo;
  /** Emits an Article node for `pageUrl`, published by the Organization. */
  article?: JsonLdArticle;
  /** Emits an ItemList node for a hub page listing these URLs in order. */
  itemList?: Array<{ name: string; url: string }>;
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
  description = "Make a UK passport photo online for GOV.UK applications and renewals, checked against HMPO guidance.",
  logoUrl = `${DEFAULT_SITE_URL}/pixpassport.jpg`,
  imageUrl = `${DEFAULT_SITE_URL}/pixpassport.jpg`,
  appName,
  appUrl,
  appId,
  applicationCategory = "PhotographyApplication",
  price = "7.99",
  priceCurrency = "GBP",
  faqItems,
  pageUrl,
  pageName,
  pageDescription,
  breadcrumbs,
  howTo,
  article,
  itemList,
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
        width: 640,
        height: 640,
      },
      image: imageUrl,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "support@pixpassport.com",
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

  const pageId = `${pageUrl ?? `${siteUrl}/`}`;
  const hasBreadcrumbs = Boolean(breadcrumbs && breadcrumbs.length > 0);

  if (pageUrl && pageName) {
    graph.push({
      "@type": "WebPage",
      "@id": `${pageId}#webpage`,
      url: pageUrl,
      name: pageName,
      ...(pageDescription ? { description: pageDescription } : {}),
      inLanguage: "en-GB",
      isPartOf: { "@id": `${siteUrl}/#website` },
      publisher: { "@id": `${siteUrl}/#organization` },
      ...(hasBreadcrumbs ? { breadcrumb: { "@id": `${pageId}#breadcrumb` } } : {}),
      ...(includeWebApp ? { mainEntity: { "@id": appId || `${siteUrl}/#webapp` } } : {}),
    });
  }

  if (faqItems && faqItems.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${pageId}#faq`,
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

  if (article && pageUrl) {
    graph.push({
      "@type": "Article",
      "@id": `${pageId}#article`,
      headline: article.headline,
      ...(article.description ? { description: article.description } : {}),
      image: article.imageUrl || imageUrl,
      ...(article.datePublished ? { datePublished: article.datePublished } : {}),
      ...(article.dateModified || article.datePublished
        ? { dateModified: article.dateModified || article.datePublished }
        : {}),
      author: { "@id": `${siteUrl}/#organization` },
      publisher: { "@id": `${siteUrl}/#organization` },
      mainEntityOfPage: { "@id": `${pageId}#webpage` },
      inLanguage: "en-GB",
    });
  }

  if (itemList && itemList.length > 0) {
    graph.push({
      "@type": "ItemList",
      "@id": `${pageId}#itemlist`,
      numberOfItems: itemList.length,
      itemListElement: itemList.map((item, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: item.name,
        url: item.url,
      })),
    });
  }

  if (howTo && howTo.steps.length > 0) {
    graph.push({
      "@type": "HowTo",
      "@id": `${pageId}#howto`,
      name: howTo.name,
      ...(howTo.description ? { description: howTo.description } : {}),
      ...(howTo.totalTime ? { totalTime: howTo.totalTime } : {}),
      ...(howTo.imageUrl ? { image: howTo.imageUrl } : {}),
      inLanguage: "en-GB",
      step: howTo.steps.map((step, idx) => ({
        "@type": "HowToStep",
        position: idx + 1,
        name: step.name,
        text: step.text,
      })),
    });
  }

  if (breadcrumbs && hasBreadcrumbs) {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${pageId}#breadcrumb`,
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
