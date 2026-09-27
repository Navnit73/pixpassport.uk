import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pixpassport.uk";

export const metadata: Metadata = {
  title: "Terms of Service — PixPassport",
  description:
    "Review the PixPassport Terms of Service governing the use of our UK passport photo maker, digital formatting tools, and download services.",
  alternates: {
    canonical: `${SITE_URL}/terms-of-service`,
    languages: {
      "en-GB": `${SITE_URL}/terms-of-service`,
    },
  },
  openGraph: {
    title: "Terms of Service — PixPassport",
    description:
      "Review the PixPassport Terms of Service governing the use of our UK passport photo maker, digital formatting tools, and download services.",
    url: `${SITE_URL}/terms-of-service`,
    siteName: "PixPassport",
    locale: "en_GB",
    type: "website",
  },
};

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar ctaText="Create Photo" ctaHref="/passport-size-photo-maker" />

      <main className="flex-1 bg-white text-slate-900" id="main-content">
        {/* Header */}
        <section className="bg-slate-50/80 py-10 sm:py-16 border-b border-slate-200/80" aria-label="Terms of Service header">
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
                  Terms of Service
                </li>
              </ol>
            </nav>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-100 border border-lime-300 text-[#365314] text-xs font-bold mb-4">
              <span>LEGAL AGREEMENT</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight mb-3">
              Terms of Service
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Last Updated: 27 September 2026 · Governed by the Laws of England and Wales
            </p>
          </div>
        </section>

        {/* Content Article */}
        <article className="container-narrow max-w-4xl py-12 sm:py-16 space-y-10 text-slate-700 leading-relaxed text-base">
          {/* 1. Acceptance */}
          <section aria-labelledby="terms-acceptance" className="space-y-3">
            <h2 id="terms-acceptance" className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
              1. Acceptance of Terms
            </h2>
            <p>
              These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you (&ldquo;User&rdquo;, &ldquo;you&rdquo;) and PixPassport (&ldquo;PixPassport&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), governing your access to and use of the website located at <Link href="/" className="text-[#365314] font-semibold underline">https://pixpassport.uk</Link> and associated photo formatting services.
            </p>
            <p>
              By accessing the website, uploading photos, or using any of our services, you confirm that you have read, understood, and agreed to be bound by these Terms. If you do not agree, you must cease using our website immediately.
            </p>
          </section>

          {/* 2. Description of Service */}
          <section aria-labelledby="terms-service" className="space-y-3">
            <h2 id="terms-service" className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
              2. Description of Service
            </h2>
            <p>
              PixPassport provides a web-based digital passport photo creation tool. Our software assists users in cropping, aligning, sizing, checking dimensional parameters, and preparing high-resolution digital passport photos and 6×4″ printable sheets compliant with HM Passport Office (HMPO) and international passport specifications.
            </p>
          </section>

          {/* 3. User Responsibilities & Image Uploads */}
          <section aria-labelledby="terms-user-resp" className="space-y-3">
            <h2 id="terms-user-resp" className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
              3. User Responsibilities &amp; Content Rights
            </h2>
            <p>
              When using PixPassport, you represent, warrant, and agree that:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                You are at least 18 years old or are accessing the service with the supervision and consent of a parent or legal guardian.
              </li>
              <li>
                You own the rights to the photograph you upload, or have explicit authorization from the subject (or the subject&rsquo;s parent/guardian) to process their photograph.
              </li>
              <li>
                The uploaded photograph is genuine, unmanipulated by deepfake or impersonation technology, and represents the true appearance of the applicant.
              </li>
              <li>
                You remain responsible for adhering to basic photography requirements (e.g. looking straight ahead, eyes open, neutral facial expression, clear lighting without heavy shadows, no tinted eyewear).
              </li>
            </ul>
          </section>

          {/* 4. Prohibited Usage */}
          <section aria-labelledby="terms-prohibited" className="space-y-3">
            <h2 id="terms-prohibited" className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
              4. Permitted and Prohibited Uses
            </h2>
            <p>
              You agree not to use PixPassport for any unlawful purpose or in any way that could impair the operation of the service. You may not:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Upload fraudulent, defamatory, obscene, harassing, or unlawful imagery.</li>
              <li>Attempt to reverse-engineer, decompile, scrape, or extract source code from the website.</li>
              <li>Use automated scripts, bots, or scrapers to access the service without express written consent.</li>
              <li>Bypass security controls, rate limits, or server isolation measures.</li>
            </ul>
          </section>

          {/* 5. Pricing and Payments */}
          <section aria-labelledby="terms-pricing" className="space-y-3">
            <h2 id="terms-pricing" className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
              5. Fees and Payment
            </h2>
            <p>
              Digital passport photo packages are offered for a flat fee of £7.99 per completed photo result. Payment is processed securely via accredited third-party payment gateways. All prices are in British Pounds (GBP) inclusive of applicable taxes.
            </p>
            <p>
              Upon successful payment processing, the user is provided with immediate access to download the full high-resolution digital passport photo and printable 6×4″ sheet.
            </p>
          </section>

          {/* 6. Acceptance Disclaimer & Limitations */}
          <section aria-labelledby="terms-disclaimer" className="space-y-3">
            <h2 id="terms-disclaimer" className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
              6. Service Functionality &amp; Government Acceptance Disclaimer
            </h2>
            <p>
              PixPassport is an independent technical compliance formatting utility and is not affiliated with, endorsed by, or part of HM Passport Office (HMPO), the UK Home Office, or any foreign government agency.
            </p>
            <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-4 text-sm text-slate-800 font-medium">
              <p>
                <strong>Important Notice:</strong> While PixPassport algorithms adjust your photo to official dimensional specifications (35×45 mm, head size, eye level, top clearance), final acceptance of any passport or visa application remains solely at the discretion of the issuing passport authority or consular examiner.
              </p>
            </div>
          </section>

          {/* 7. Refund Policy Reference */}
          <section aria-labelledby="terms-refunds" className="space-y-3">
            <h2 id="terms-refunds" className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
              7. Refunds &amp; Guarantee
            </h2>
            <p>
              Our refund policy and dimensional acceptance guarantee are governed by our dedicated <Link href="/refund-policy" className="text-[#365314] font-semibold underline">Refund Policy</Link>, which forms an integral part of these Terms.
            </p>
          </section>

          {/* 8. Intellectual Property */}
          <section aria-labelledby="terms-ip" className="space-y-3">
            <h2 id="terms-ip" className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
              8. Intellectual Property Rights
            </h2>
            <p>
              All website content, interfaces, logos, code, software, algorithms, and design assets on PixPassport are the exclusive property of PixPassport and are protected by UK and international copyright, trademark, and database laws.
            </p>
            <p>
              You retain full copyright and ownership of any photograph you upload to our platform.
            </p>
          </section>

          {/* 9. Limitation of Liability */}
          <section aria-labelledby="terms-liability" className="space-y-3">
            <h2 id="terms-liability" className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
              9. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable UK law, PixPassport shall not be liable for any indirect, incidental, consequential, special, or punitive damages, including missed travel, application rescheduling fees, or lost profits arising from the use of or inability to use the service.
            </p>
            <p>
              Nothing in these Terms limits or excludes liability for death or personal injury caused by negligence, fraud, or any liability that cannot be excluded under English law.
            </p>
          </section>

          {/* 10. Governing Law */}
          <section aria-labelledby="terms-governing" className="space-y-3">
            <h2 id="terms-governing" className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
              10. Governing Law and Jurisdiction
            </h2>
            <p>
              These Terms and any dispute or claim arising out of or in connection with them shall be governed by and construed in accordance with the laws of England and Wales. The courts of England and Wales shall have exclusive jurisdiction.
            </p>
          </section>

          {/* 11. Contact Information */}
          <section aria-labelledby="terms-contact" className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 id="terms-contact" className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              11. Contact Us Regarding Terms
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              If you have any questions or clarifications regarding these Terms of Service, please contact our support team:
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
