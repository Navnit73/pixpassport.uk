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

const DEFAULT_JSONLD_FAQS: JsonLdFaqEntry[] = [
  {
    question: "What are the official UK passport photo requirements?",
    answer:
      "UK passport photos must be 35 mm wide × 45 mm tall, with a plain white or light grey background. Your face must be clearly visible with a neutral expression, mouth closed, and eyes open. The photo must be in sharp focus with no red-eye. PixPassport automatically sizes your photo to meet these requirements.",
  },
  {
    question: "How do I create a digital photo for passport renewal?",
    answer:
      "Upload a recent, well-lit photo of yourself to PixPassport. The tool will help you crop and adjust it to the official 35 mm × 45 mm dimensions. You can then download the digital photo for your passport renewal application, ready to submit online or print at home.",
  },
  {
    question: "Is PixPassport really free?",
    answer:
      "Yes, PixPassport is completely free with no hidden charges. You can create and download as many passport photos as you need without paying anything or creating an account.",
  },
  {
    question: "Are photos processed on your servers?",
    answer:
      "No. All photo processing happens entirely within your web browser. Your photos are never uploaded to any server, ensuring complete privacy. Once you close the page, no trace of your photo remains.",
  },
  {
    question: "Can I print my passport photo at home?",
    answer:
      "Absolutely. The download includes a print-ready file sized for standard 6×4 inch (10×15 cm) photo paper, which you can print at home or at any pharmacy or printing service.",
  },
  {
    question: "Will my photo be accepted by HM Passport Office?",
    answer:
      "PixPassport formats your photo to meet the official HMPO dimensional requirements. However, the quality and suitability of the original photo (lighting, expression, background) is your responsibility. We recommend following the tips provided in the upload section.",
  },
  {
    question: "What file formats are supported?",
    answer:
      "PixPassport accepts JPEG, PNG, and WebP image files up to 10 MB in size. For best results, use a high-resolution photo with good lighting.",
  },
];

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
  faqItems = DEFAULT_JSONLD_FAQS,
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
