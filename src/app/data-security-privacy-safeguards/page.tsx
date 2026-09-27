import type { Metadata } from "next";
import Link from "next/link";
import {
  Lock,
  EyeOff,
  Trash2,
  KeyRound,
  CreditCard,
  UserCheck,
  CheckCircle,
  Mail,
  ShieldCheck,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pixpassport.uk";

export const metadata: Metadata = {
  title: "Data Security & Privacy Safeguards",
  description:
    "Explore PixPassport's technical security safeguards, TLS 1.3 encryption, in-browser compression, and zero-retention biometric privacy architecture.",
  alternates: {
    canonical: `${SITE_URL}/data-security-privacy-safeguards`,
    languages: {
      "en-GB": `${SITE_URL}/data-security-privacy-safeguards`,
    },
  },
  openGraph: {
    title: "Data Security & Privacy Safeguards — PixPassport",
    description:
      "Explore PixPassport's technical security safeguards, TLS 1.3 encryption, in-browser compression, and zero-retention biometric privacy architecture.",
    url: `${SITE_URL}/data-security-privacy-safeguards`,
    siteName: "PixPassport",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/pixpassport.jpg`,
        width: 1200,
        height: 630,
        alt: "PixPassport Data Security & Privacy Safeguards",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Data Security & Privacy Safeguards — PixPassport",
    description:
      "Explore PixPassport's technical security safeguards, TLS 1.3 encryption, in-browser compression, and zero-retention biometric privacy architecture.",
    images: [`${SITE_URL}/pixpassport.jpg`],
  },
};

export default function DataSecurityPrivacySafeguardsPage() {
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
        name: "Data Security & Privacy Safeguards",
        item: `${SITE_URL}/data-security-privacy-safeguards`,
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
        {/* Hero Section */}
        <section className="bg-slate-50/80 py-10 sm:py-16 border-b border-slate-200/80" aria-label="Data security and safeguards overview">
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
                  Data Security &amp; Privacy Safeguards
                </li>
              </ol>
            </nav>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-100 border border-lime-300 text-[#365314] text-xs font-bold mb-4">
              <span>🔒 PRIVACY-FIRST ARCHITECTURE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight mb-4">
              Data Security &amp; Privacy Safeguards
            </h1>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              PixPassport is built from the ground up to protect your personal photographs and privacy. This document outlines our actual technical safeguards, transmission security, and data handling practices.
            </p>
          </div>
        </section>

        {/* Content Article */}
        <article className="container-narrow max-w-4xl py-12 sm:py-16 space-y-12">
          {/* Summary Box */}
          <div className="bg-lime-50/70 border border-lime-300 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[#0F172A] mb-3 flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-[#4D7C0F]" aria-hidden="true" />
              <span>Core Security Principles</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-800 font-medium">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#4D7C0F] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Zero long-term biometric or facial photo storage</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#4D7C0F] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Client-side in-browser image optimization</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#4D7C0F] shrink-0 mt-0.5" aria-hidden="true" />
                <span>End-to-end TLS 1.3 encrypted data transmission</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#4D7C0F] shrink-0 mt-0.5" aria-hidden="true" />
                <span>No user account creation or tracking profiles</span>
              </div>
            </div>
          </div>

          {/* 1. Client-Side Processing & Memory Handling */}
          <section aria-labelledby="client-side-heading" className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-lime-50 border border-lime-200 flex items-center justify-center text-[#4D7C0F]" aria-hidden="true">
                <EyeOff className="w-5 h-5" />
              </div>
              <h2 id="client-side-heading" className="text-2xl font-bold text-[#0F172A] tracking-tight">
                1. In-Browser Image Processing
              </h2>
            </div>
            <p className="text-slate-700 leading-relaxed text-base">
              Whenever you upload a photograph to PixPassport, initial image inspection, local previews, and size pre-compression (down to &le; 3 MB) occur directly inside your browser via standard HTML5 Canvas and Web APIs.
            </p>
            <p className="text-slate-700 leading-relaxed text-base">
              This ensures your uncompressed high-resolution original file never leaves your computer or phone unnecessarily, minimizing bandwidth and exposure.
            </p>
          </section>

          {/* 2. Encryption in Transit */}
          <section aria-labelledby="encryption-heading" className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-lime-50 border border-lime-200 flex items-center justify-center text-[#4D7C0F]" aria-hidden="true">
                <Lock className="w-5 h-5" />
              </div>
              <h2 id="encryption-heading" className="text-2xl font-bold text-[#0F172A] tracking-tight">
                2. Encrypted Transmission (TLS 1.3 / HTTPS)
              </h2>
            </div>
            <p className="text-slate-700 leading-relaxed text-base">
              When processing requires automated biometric alignment and background formatting, your image payload is transmitted over an encrypted HTTPS connection utilizing modern Transport Layer Security (TLS 1.3) protocols.
            </p>
            <p className="text-slate-700 leading-relaxed text-base">
              HTTP Strict Transport Security (HSTS) is enforced to ensure man-in-the-middle attacks and protocol downgrades are prevented.
            </p>
          </section>

          {/* 3. Zero Permanent Storage & Ephemeral Processing */}
          <section aria-labelledby="retention-heading" className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-lime-50 border border-lime-200 flex items-center justify-center text-[#4D7C0F]" aria-hidden="true">
                <Trash2 className="w-5 h-5" />
              </div>
              <h2 id="retention-heading" className="text-2xl font-bold text-[#0F172A] tracking-tight">
                3. Zero Permanent Storage &amp; Automatic Deletion
              </h2>
            </div>
            <p className="text-slate-700 leading-relaxed text-base">
              PixPassport does not maintain a permanent facial database, biometric repository, or photo gallery of uploaded images.
            </p>
            <p className="text-slate-700 leading-relaxed text-base">
              Images sent for processing exist in ephemeral memory only for the brief duration required to detect face boundaries, crop, and generate the final print output. Once the session is concluded, server-side processing artifacts are automatically deleted.
            </p>
          </section>

          {/* 4. API Key Isolation & Server-Side Proxies */}
          <section aria-labelledby="isolation-heading" className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-lime-50 border border-lime-200 flex items-center justify-center text-[#4D7C0F]" aria-hidden="true">
                <KeyRound className="w-5 h-5" />
              </div>
              <h2 id="isolation-heading" className="text-2xl font-bold text-[#0F172A] tracking-tight">
                4. Server-Side Security Isolation
              </h2>
            </div>
            <p className="text-slate-700 leading-relaxed text-base">
              All interactions with backend processing services are isolated inside Next.js server-side route handlers (<code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono text-slate-800">/api/passport-photo</code>).
            </p>
            <p className="text-slate-700 leading-relaxed text-base">
              Secret API keys, credentials, and internal endpoints are never exposed to client browsers or visible in network inspection tools.
            </p>
          </section>

          {/* 5. Payment Security */}
          <section aria-labelledby="payment-heading" className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-lime-50 border border-lime-200 flex items-center justify-center text-[#4D7C0F]" aria-hidden="true">
                <CreditCard className="w-5 h-5" />
              </div>
              <h2 id="payment-heading" className="text-2xl font-bold text-[#0F172A] tracking-tight">
                5. Payment Processing Security
              </h2>
            </div>
            <p className="text-slate-700 leading-relaxed text-base">
              Payment transactions are conducted through accredited, PCI-DSS Level 1 compliant payment service providers.
            </p>
            <p className="text-slate-700 leading-relaxed text-base">
              PixPassport never handles, processes, or stores your raw credit or debit card numbers, CVVs, or banking credentials on our web servers.
            </p>
          </section>

          {/* 6. User Privacy Rights & Local Control */}
          <section aria-labelledby="rights-heading" className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-lime-50 border border-lime-200 flex items-center justify-center text-[#4D7C0F]" aria-hidden="true">
                <UserCheck className="w-5 h-5" />
              </div>
              <h2 id="rights-heading" className="text-2xl font-bold text-[#0F172A] tracking-tight">
                6. User Privacy Rights &amp; Client Storage Control
              </h2>
            </div>
            <p className="text-slate-700 leading-relaxed text-base">
              Result previews and session references are kept in your browser&rsquo;s temporary <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono text-slate-800">sessionStorage</code> and <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono text-slate-800">localStorage</code>.
            </p>
            <p className="text-slate-700 leading-relaxed text-base">
              You can instantly purge all locally stored references at any time simply by closing your browser tab or clearing your browser site data. Under the UK GDPR, you have the right to request confirmation of any data processed or request technical support assistance.
            </p>
          </section>

          {/* 7. Incident Response & Security Contact */}
          <section aria-labelledby="contact-sec-heading" className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 id="contact-sec-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Security Contacts &amp; Inquiries
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              If you have any questions about our data security architecture or wish to report a security inquiry, please contact our technical team directly:
            </p>
            <div className="pt-2">
              <a
                href="mailto:support@pixpassport.uk"
                className="inline-flex items-center gap-2 bg-[#4D7C0F] hover:bg-[#3F650C] text-white font-bold text-sm px-5 py-3 rounded-xl transition-colors focus-ring"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span>support@pixpassport.uk</span>
              </a>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </>
  );
}
