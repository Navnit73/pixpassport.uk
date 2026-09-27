const SITE_URL = "https://pixpassport.uk";

/** FAQ items matching the visible FAQ section content exactly. */
const faqEntries = [
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
 * Returns JSON-LD structured data for the homepage.
 *
 * Includes: Organization, WebSite, WebApplication, FAQPage.
 * No fabricated ratings, reviews, or government affiliations.
 */
export default function JsonLd() {
  const organization = {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "PixPassport",
    url: SITE_URL,
    logo: `${SITE_URL}/pixpassport.jpg`,
    image: `${SITE_URL}/pixpassport.jpg`,
  };

  const website = {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "PixPassport",
    description:
      "Create a digital photo for passport applications and renewals online. Free UK passport photo maker.",
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-GB",
  };

  const webApplication = {
    "@type": "WebApplication",
    "@id": `${SITE_URL}/#webapp`,
    name: "PixPassport",
    url: SITE_URL,
    description:
      "Free online UK passport photo maker. Upload a photo, adjust to 35mm × 45mm, and download a print-ready digital photo for passport applications and renewals.",
    applicationCategory: "PhotographyApplication",
    operatingSystem: "All",
    browserRequirements: "Requires a modern web browser with JavaScript enabled",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "GBP",
    },
    provider: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-GB",
  };

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: faqEntries.map((entry) => ({
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
