import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pixpassport.uk";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the PixPassport Privacy Policy. Understand what data we collect, our UK GDPR compliance, cookie practices, and how your privacy is protected.",
  alternates: {
    canonical: `${SITE_URL}/privacy-policy`,
    languages: {
      "en-GB": `${SITE_URL}/privacy-policy`,
    },
  },
  openGraph: {
    title: "Privacy Policy — PixPassport",
    description:
      "Read the PixPassport Privacy Policy. Understand what data we collect, our UK GDPR compliance, cookie practices, and how your privacy is protected.",
    url: `${SITE_URL}/privacy-policy`,
    siteName: "PixPassport",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/pixpassport.jpg`,
        width: 1200,
        height: 630,
        alt: "PixPassport Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy — PixPassport",
    description:
      "Read the PixPassport Privacy Policy. Understand what data we collect, our UK GDPR compliance, cookie practices, and how your privacy is protected.",
    images: [`${SITE_URL}/pixpassport.jpg`],
  },
};

export default function PrivacyPolicyPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Privacy Policy",
        item: `${SITE_URL}/privacy-policy`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Navbar ctaText="Create Photo" ctaHref="/passport-size-photo-maker" />

      <main className="flex-1 bg-white text-slate-900" id="main-content">
        {/* Header */}
        <section className="bg-slate-50/80 py-10 sm:py-16 border-b border-slate-200/80" aria-label="Privacy Policy header">
          <div className="container-narrow max-w-4xl">
            {/* Breadcrumb */}
            <nav className="text-xs text-slate-600 mb-4" aria-label="Breadcrumb">
              <ol className="flex items-center gap-1.5 list-none p-0 m-0">
                <li>
                  <Link href="/" className="text-slate-600 hover:text-lime-800 transition-colors font-medium">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-slate-900 font-semibold" aria-current="page">
                  Privacy Policy
                </li>
              </ol>
            </nav>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-100 border border-lime-300 text-[#365314] text-xs font-bold mb-4">
              <span>LEGAL &amp; COMPLIANCE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight mb-3">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Last Updated: 27 September 2026 · Governed by the UK Data Protection Act 2018 &amp; UK GDPR
            </p>
          </div>
        </section>

        {/* Content Article */}
        <article className="container-narrow max-w-4xl py-12 sm:py-16 space-y-10 text-slate-700 leading-relaxed text-base">
          {/* 1. Introduction */}
          <section aria-labelledby="section-intro" className="space-y-3">
            <h2 id="section-intro" className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
              1. Introduction &amp; Scope
            </h2>
            <p>
              PixPassport (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), accessible at <Link href="/" className="text-[#365314] font-semibold underline">https://pixpassport.uk</Link>, provides an online passport and biometric photo formatting platform.
            </p>
            <p>
              We are committed to safeguarding the privacy and personal data of our website visitors and service users. This Privacy Policy explains what personal information we collect, how we process it, the legal bases for processing under the UK General Data Protection Regulation (UK GDPR) and Data Protection Act 2018, and your statutory rights.
            </p>
          </section>

          {/* 2. Information We Collect */}
          <section aria-labelledby="section-collection" className="space-y-3">
            <h2 id="section-collection" className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
              2. Information We Collect
            </h2>
            <p>
              We adhere strictly to the principle of data minimisation. We only collect or process data strictly required to deliver our photo creation and customer support services:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>User-Uploaded Photographs:</strong> Image files (JPEG, PNG, WebP) uploaded to format, crop, and verify passport dimensions.
              </li>
              <li>
                <strong>Customer Support Data:</strong> Information provided voluntarily when contacting us (your name, email address, subject, result ID, and message content).
              </li>
              <li>
                <strong>Technical &amp; Log Data:</strong> Standard server logs containing anonymised IP addresses, browser types, device categories, operating systems, and timestamp data for system security and anti-fraud monitoring.
              </li>
            </ul>
          </section>

          {/* 3. Purpose and Legal Basis for Processing */}
          <section aria-labelledby="section-basis" className="space-y-3">
            <h2 id="section-basis" className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
              3. Purpose and Legal Basis for Processing
            </h2>
            <p>
              Under UK GDPR Article 6, we process your personal data under the following legal bases:
            </p>
            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <strong className="text-slate-900 block font-bold mb-1">Performance of a Contract (Article 6(1)(b)):</strong>
                <span className="text-sm">Processing uploaded images to generate compliant digital passport photos and 6×4″ printable sheets requested by you.</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <strong className="text-slate-900 block font-bold mb-1">Legitimate Interests (Article 6(1)(f)):</strong>
                <span className="text-sm">Responding to customer inquiries, preventing abuse, ensuring server security, and maintaining website stability.</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <strong className="text-slate-900 block font-bold mb-1">Legal Obligation (Article 6(1)(c)):</strong>
                <span className="text-sm">Retaining financial transaction records for statutory accounting and tax compliance where applicable.</span>
              </div>
            </div>
          </section>

          {/* 4. Cookies and Client Storage */}
          <section aria-labelledby="section-cookies" className="space-y-3">
            <h2 id="section-cookies" className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
              4. Cookies and Local Storage
            </h2>
            <p>
              PixPassport does not use invasive advertising cookies or cross-site tracking networks. We utilize standard, strictly necessary browser storage mechanisms:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
              <li>
                <strong>Session &amp; Local Storage (<code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">sessionStorage</code> / <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">localStorage</code>):</strong> Used solely to preserve your active photo processing result ID across browser navigation so you can view and download your generated photo.
              </li>
              <li>
                You can clear locally stored session artifacts at any time by clearing your browser cache or closing your browser window.
              </li>
            </ul>
          </section>

          {/* 5. Payment Processing */}
          <section aria-labelledby="section-payment" className="space-y-3">
            <h2 id="section-payment" className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
              5. Payment Processing
            </h2>
            <p>
              When purchasing a digital passport photo package (£7.99), payment transactions are handled through certified third-party payment processors. We never collect, store, or view full payment card numbers or banking secrets.
            </p>
          </section>

          {/* 6. Data Retention & Deletion */}
          <section aria-labelledby="section-retention" className="space-y-3">
            <h2 id="section-retention" className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
              6. Data Retention and Automated Deletion
            </h2>
            <p>
              Uploaded photographs and generated passport images are retained only for the ephemeral duration needed to generate your output files and complete your download.
            </p>
            <p>
              Customer support correspondence is retained for up to 12 months solely for auditing, resolving refund requests, and customer service continuity, after which it is securely deleted.
            </p>
          </section>

          {/* 7. Third-Party Services & International Transfers */}
          <section aria-labelledby="section-transfers" className="space-y-3">
            <h2 id="section-transfers" className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
              7. Third-Party Service Providers &amp; Data Transfers
            </h2>
            <p>
              We do not sell, rent, or trade your personal information. We may engage vetted technical infrastructure service providers (cloud hosting, DNS routing, secure CDN delivery) to host and serve our platform.
            </p>
            <p>
              Where technical providers operate outside the United Kingdom or European Economic Area (EEA), transfers are governed by UK International Data Transfer Agreements (IDTAs) or European Commission Standard Contractual Clauses (SCCs) to guarantee equivalent data protection.
            </p>
          </section>

          {/* 8. Children's Privacy */}
          <section aria-labelledby="section-children" className="space-y-3">
            <h2 id="section-children" className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
              8. Children&rsquo;s Privacy
            </h2>
            <p>
              PixPassport allows parents and legal guardians to format passport photos for infants, toddlers, and children under 16 for official travel documents. We do not knowingly create user accounts or profile children. Any child photograph is processed strictly at the direction and consent of the parent or legal guardian.
            </p>
          </section>

          {/* 9. Your Rights Under UK GDPR */}
          <section aria-labelledby="section-rights" className="space-y-3">
            <h2 id="section-rights" className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
              9. Your Statutory Privacy Rights
            </h2>
            <p>
              Under UK data protection law, you have specific rights regarding your personal information:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
              <li><strong>Right of Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Right to Rectification:</strong> Request correction of inaccurate personal data.</li>
              <li><strong>Right to Erasure (&ldquo;Right to be Forgotten&rdquo;):</strong> Request deletion of your personal data where retention is no longer necessary.</li>
              <li><strong>Right to Restrict Processing:</strong> Request suspension of processing under certain circumstances.</li>
              <li><strong>Right to Data Portability:</strong> Request transfer of your data in a structured, commonly used format.</li>
              <li><strong>Right to Object:</strong> Object to processing based on legitimate interests.</li>
              <li><strong>Right to Complain:</strong> You have the right to lodge a complaint with the UK Information Commissioner&rsquo;s Office (ICO) at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-[#365314] font-semibold underline">ico.org.uk</a>.</li>
            </ul>
          </section>

          {/* 10. Contact Us & Exercising Rights */}
          <section aria-labelledby="section-contact" className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 id="section-contact" className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              10. Contact &amp; Privacy Requests
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              To exercise any of your statutory privacy rights, request data deletion, or ask questions about this policy, please contact our privacy team:
            </p>
            <div className="pt-2">
              <a
                href="mailto:support@pixpassport.com"
                className="inline-flex items-center gap-2 bg-[#4D7C0F] hover:bg-[#3F650C] text-white font-bold text-sm px-5 py-3 rounded-xl transition-colors focus-ring"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span>support@pixpassport.com</span>
              </a>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </>
  );
}
