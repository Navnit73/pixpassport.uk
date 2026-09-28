import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Clock, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pixpassport.uk";

export const metadata: Metadata = {
  title: "Contact Us — Customer Support & Inquiries",
  description:
    "Contact PixPassport customer support for assistance with UK passport photos, biometric compliance queries, refund requests, or order inquiries.",
  alternates: {
    canonical: `${SITE_URL}/contact-us`,
    languages: {
      "en-GB": `${SITE_URL}/contact-us`,
    },
  },
  openGraph: {
    title: "Contact PixPassport Support",
    description:
      "Contact PixPassport customer support for assistance with UK passport photos, biometric compliance queries, refund requests, or order inquiries.",
    url: `${SITE_URL}/contact-us`,
    siteName: "PixPassport",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/pixpassport.jpg`,
        width: 1200,
        height: 630,
        alt: "PixPassport Customer Support",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact PixPassport Support",
    description:
      "Contact PixPassport customer support for assistance with UK passport photos, biometric compliance queries, refund requests, or order inquiries.",
    images: [`${SITE_URL}/pixpassport.jpg`],
  },
};

export default function ContactUsPage() {
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
        name: "Contact Us",
        item: `${SITE_URL}/contact-us`,
      },
    ],
  };

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact PixPassport",
    description:
      "Contact PixPassport customer support for help with UK passport photo requirements, downloads, or technical assistance.",
    url: `${SITE_URL}/contact-us`,
    mainEntity: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "PixPassport",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/pixpassport.jpg`,
        width: 512,
        height: 512,
      },
      contactPoint: {
        "@type": "ContactPoint",
        email: "support@pixpassport.uk",
        contactType: "customer support",
        areaServed: "GB",
        availableLanguage: ["English"],
      },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />

      <Navbar ctaText="Create Photo" ctaHref="/passport-size-photo-maker" />

      <main
        className="flex-1 bg-slate-50 min-h-screen py-8 sm:py-14 text-slate-900"
        id="main-content"
      >
        <div className="container-narrow max-w-4xl px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="text-xs text-slate-600 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 list-none p-0 m-0">
              <li>
                <Link
                  href="/"
                  className="text-slate-600 hover:text-lime-800 transition-colors font-medium"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-slate-900 font-semibold" aria-current="page">
                Contact Us
              </li>
            </ol>
          </nav>

          {/* Page Heading */}
          <div className="mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-100 border border-lime-300 text-[#365314] text-xs font-bold mb-3">
              <span>SUPPORT &amp; INQUIRIES</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
              Contact PixPassport Support
            </h1>
            <p className="text-slate-700 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Have questions about UK passport photo requirements, an existing
              download session, or need assistance? Fill out the form below or
              email us directly.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Form Column */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

            {/* Sidebar Information Column */}
            <div className="lg:col-span-5 space-y-6">
              {/* Direct Contact Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#4D7C0F]" aria-hidden="true" />
                  <span>Direct Support</span>
                </h2>
                <div className="space-y-3.5 text-sm text-slate-700">
                  <div>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">
                      Email Address
                    </span>
                    <a
                      href="mailto:support@pixpassport.uk"
                      className="text-base font-bold text-[#365314] hover:underline"
                    >
                      support@pixpassport.uk
                    </a>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">
                      Operating Hours
                    </span>
                    <p className="text-slate-800 font-medium">
                      Monday – Friday: 9:00 AM – 5:00 PM GMT
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">
                      Response Expectations
                    </span>
                    <p className="text-slate-800 font-medium flex items-center gap-1.5">
                      <Clock
                        className="w-4 h-4 text-slate-600 shrink-0"
                        aria-hidden="true"
                      />
                      <span>Replies within 24 business hours</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Guidance Box */}
              <div className="bg-lime-50 border border-lime-200 rounded-2xl p-6 text-xs text-slate-800 space-y-3">
                <h3 className="font-bold text-sm text-[#365314] flex items-center gap-2">
                  <Shield
                    className="w-4 h-4 text-[#4D7C0F]"
                    aria-hidden="true"
                  />
                  <span>Acceptance Guarantee</span>
                </h3>
                <p className="leading-relaxed font-medium">
                  If your passport photo created on PixPassport is rejected by HM
                  Passport Office or your destination visa authority for
                  dimensional reasons, we will gladly re-process your photo or
                  issue a full refund in accordance with our{" "}
                  <Link
                    href="/refund-policy"
                    className="font-bold underline text-[#365314]"
                  >
                    Refund Policy
                  </Link>
                  .
                </p>
              </div>

              {/* Useful Links Box */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 text-sm space-y-3 shadow-xs">
                <h3 className="font-bold text-slate-900">
                  Frequently Accessed:
                </h3>
                <ul className="space-y-2 list-none p-0 m-0 text-slate-700">
                  <li>
                    <Link
                      href="/#faq"
                      className="hover:text-lime-800 hover:underline font-medium"
                    >
                      • Frequently Asked Questions
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#photo-rules"
                      className="hover:text-lime-800 hover:underline font-medium"
                    >
                      • Official UK Photo Sizing Rules
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/data-security-privacy-safeguards"
                      className="hover:text-lime-800 hover:underline font-medium"
                    >
                      • Data Security &amp; Privacy Safeguards
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/refund-policy"
                      className="hover:text-lime-800 hover:underline font-medium"
                    >
                      • Refund Policy &amp; Terms
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
