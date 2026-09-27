import type { Metadata } from "next";
import Link from "next/link";
import {
  Award,
  CheckCircle,
  Check,
  Eye,
  Lock,
  Mail,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pixpassport.uk";

export const metadata: Metadata = {
  title: "About Us — UK Passport Photo Maker & Biometric Sizing",
  description:
    "Learn about PixPassport.uk — our mission, privacy-first technology, UK HMPO compliance standards, and commitment to accessible passport photo creation.",
  alternates: {
    canonical: `${SITE_URL}/about-us`,
    languages: {
      "en-GB": `${SITE_URL}/about-us`,
    },
  },
  openGraph: {
    title: "About Us — PixPassport",
    description:
      "Learn about PixPassport.uk — our mission, privacy-first technology, UK HMPO compliance standards, and commitment to accessible passport photo creation.",
    url: `${SITE_URL}/about-us`,
    siteName: "PixPassport",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/pixpassport.jpg`,
        width: 1200,
        height: 630,
        alt: "About PixPassport — UK Passport Photo Maker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us — PixPassport",
    description:
      "Learn about PixPassport.uk — our mission, privacy-first technology, UK HMPO compliance standards, and commitment to accessible passport photo creation.",
    images: [`${SITE_URL}/pixpassport.jpg`],
  },
};

export default function AboutUsPage() {
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
        name: "About Us",
        item: `${SITE_URL}/about-us`,
      },
    ],
  };

  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About PixPassport",
    description:
      "PixPassport is an independent, privacy-focused online passport and biometric photo formatting tool.",
    url: `${SITE_URL}/about-us`,
    publisher: {
      "@type": "Organization",
      name: "PixPassport",
      url: SITE_URL,
      logo: `${SITE_URL}/pixpassport.jpg`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />

      <Navbar ctaText="Create Photo" ctaHref="/passport-size-photo-maker" />

      <main className="flex-1 bg-white text-slate-900" id="main-content">
        {/* Header & Hero */}
        <section className="bg-slate-50/80 py-10 sm:py-16 border-b border-slate-200/80" aria-label="About PixPassport header">
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
                  About Us
                </li>
              </ol>
            </nav>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-100 border border-lime-300 text-[#365314] text-xs font-bold mb-4">
              <span>🇬🇧 UK DOCUMENT SPECIALISTS</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight mb-4">
              About PixPassport
            </h1>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              PixPassport is an independent, privacy-focused online photo formatting and compliance tool built specifically for UK passport applicants and international travellers.
            </p>
          </div>
        </section>

        {/* Main Content Article */}
        <article className="container-narrow max-w-4xl py-12 sm:py-16 space-y-12">
          {/* 1. Our Mission & Story */}
          <section aria-labelledby="mission-heading" className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-lime-50 border border-lime-200 flex items-center justify-center text-[#4D7C0F]" aria-hidden="true">
                <Award className="w-5 h-5" />
              </div>
              <h2 id="mission-heading" className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
                Our Mission &amp; Purpose
              </h2>
            </div>
            <p className="text-slate-700 leading-relaxed text-base">
              Applying for or renewing a passport should not require searching for a coin-operated photo booth, paying extortionate studio fees, or risking application delays due to minor formatting errors.
            </p>
            <p className="text-slate-700 leading-relaxed text-base">
              Our mission is to give every UK citizen and international applicant the tools to transform a clear photo taken at home on a modern smartphone into a fully compliant biometric passport picture in under 10 seconds — with zero data harvesting, transparent pricing, and guaranteed adherence to official specifications.
            </p>
          </section>

          {/* 2. Problems We Solve */}
          <section aria-labelledby="problems-heading" className="space-y-6">
            <h2 id="problems-heading" className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
              The Challenges We Solve
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <h3 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#4D7C0F] shrink-0" aria-hidden="true" />
                  <span>Preventing Photo Rejections</span>
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Over 15% of online passport rejections happen because head size (must be 29–34 mm), eye level, or crown clearance violates HMPO standards. PixPassport calculates biometric ratios automatically.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <h3 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#4D7C0F] shrink-0" aria-hidden="true" />
                  <span>Eliminating Booth Costs</span>
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  High-street booths frequently charge £12 to £15 for printed strips that cannot be uploaded digitally, offering no retakes or lighting adjustments. We provide both digital and printable files for a flat £7.99.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <h3 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#4D7C0F] shrink-0" aria-hidden="true" />
                  <span>100% In-Browser Privacy</span>
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Unlike platforms that catalogue personal faces to train AI models or sell contact data, your photo is processed ephemerally for your active session only.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <h3 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#4D7C0F] shrink-0" aria-hidden="true" />
                  <span>Zero Software Needed</span>
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  No Photoshop, no image editors, and no technical skills required. Everything works in your browser on iOS, Android, macOS, and Windows.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Core Features & What We Provide */}
          <section aria-labelledby="features-heading" className="space-y-6">
            <h2 id="features-heading" className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
              Core Capabilities &amp; Services
            </h2>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4">
              <ul className="space-y-3.5 list-none p-0 m-0">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#4D7C0F] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <strong className="text-slate-900 block">HMPO &amp; ICAO Dimension Compliance:</strong>
                    <span className="text-slate-700 text-sm">Official UK 35 mm × 45 mm (600×750 px at 600 DPI) sizing with 70–80% vertical head ratio alignment.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#4D7C0F] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <strong className="text-slate-900 block">50+ Global Country Document Standards:</strong>
                    <span className="text-slate-700 text-sm">Preset dimensions and rules for the United States (2×2″), Schengen Area (35×45 mm), Australia, Canada, India, and more.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#4D7C0F] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <strong className="text-slate-900 block">Standard 6×4″ (10×15 cm) Printable Grid:</strong>
                    <span className="text-slate-700 text-sm">Generates a 4-up or 6-up printable sheet ready for standard photo kiosks (Boots, Tesco, Asda) or home photo printing.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#4D7C0F] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <strong className="text-slate-900 block">Smart In-Browser Compression:</strong>
                    <span className="text-slate-700 text-sm">Ensures file sizes remain strictly within the required 50 KB to 10 MB range without sacrificing biometric facial clarity.</span>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* 4. Commitment to Accessibility & Privacy */}
          <section aria-labelledby="commitment-heading" className="space-y-6">
            <h2 id="commitment-heading" className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
              Commitment to Accessibility &amp; Data Ethics
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/70">
                <div className="w-10 h-10 rounded-xl bg-lime-50 border border-lime-200 text-[#4D7C0F] flex items-center justify-center mb-4" aria-hidden="true">
                  <Eye className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">WCAG 2.2 AA Accessibility</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  We believe essential government services must be accessible to everyone. PixPassport is engineered to meet WCAG 2.2 Level AA accessibility standards, featuring complete keyboard navigation, high-contrast visual elements, screen-reader landmarks, and reduced-motion preferences.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/70">
                <div className="w-10 h-10 rounded-xl bg-lime-50 border border-lime-200 text-[#4D7C0F] flex items-center justify-center mb-4" aria-hidden="true">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">UK GDPR &amp; Privacy First</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  We adhere strictly to the UK Data Protection Act 2018 and UK GDPR. We do not require account creation, do not sell user data, and employ ephemeral session handling so your images are never stored long term.
                </p>
              </div>
            </div>
          </section>

          {/* 5. Contact & Support Information */}
          <section aria-labelledby="contact-summary-heading" className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 id="contact-summary-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Questions or Feedback?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Our support team is based in the UK and is available to assist with any questions regarding photo requirements, orders, or technical queries.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="mailto:support@pixpassport.uk"
                className="inline-flex items-center gap-2 bg-[#4D7C0F] hover:bg-[#3F650C] text-white font-bold text-sm px-5 py-3 rounded-xl transition-colors focus-ring"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span>support@pixpassport.uk</span>
              </a>
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-sm px-5 py-3 rounded-xl border border-slate-700 transition-colors focus-ring"
              >
                <span>Contact Form</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </>
  );
}
