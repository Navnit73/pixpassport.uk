import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import PhotoMakerStudio from "@/components/PhotoMakerStudio";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pixpassport.uk";

export const metadata: Metadata = {
  title: "Passport Size Photo Maker Online (Official Biometric Dimensions)",
  description:
    "Create official biometric passport photos online for the UK (35×45mm), US (2×2″), Schengen Area, India, and 50+ countries. Automatic cropping, background removal, and instant download.",
  alternates: {
    canonical: `${SITE_URL}/passport-size-photo-maker`,
    languages: {
      "en-GB": `${SITE_URL}/passport-size-photo-maker`,
    },
  },
  openGraph: {
    title: "Passport Size Photo Maker Online — PixPassport",
    description:
      "Create official biometric passport photos online for the UK (35×45mm), US, Schengen Area, and 50+ countries. Automatic cropping, AI verification, and instant download.",
    url: `${SITE_URL}/passport-size-photo-maker`,
    siteName: "PixPassport",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/pixpassport.jpg`,
        width: 1200,
        height: 630,
        alt: "Passport Size Photo Maker Online — PixPassport",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Passport Size Photo Maker Online — PixPassport",
    description:
      "Create official biometric passport photos online for the UK (35×45mm), US, Schengen Area, and 50+ countries. Automatic cropping, AI verification, and instant download.",
    images: [`${SITE_URL}/pixpassport.jpg`],
  },
};

const POPULAR_TOOL_LINKS = [
  {
    slug: "uk-passport-photo",
    title: "UK Passport Photo",
    spec: "35×45 mm",
    flag: "🇬🇧",
  },
  {
    slug: "passport-renewal-photo-online",
    title: "UK Passport Renewal",
    spec: "35×45 mm",
    flag: "🔄",
  },
  {
    slug: "uk-baby-passport-photo",
    title: "UK Baby Passport Photo",
    spec: "HMPO Infant",
    flag: "👶",
  },
  {
    slug: "uk-driving-licence-photo",
    title: "UK Driving Licence",
    spec: "DVLA 35×45 mm",
    flag: "🚗",
  },
  {
    slug: "us-visa-photo-tool",
    title: "US Visa & Passport",
    spec: "2×2 inches",
    flag: "🇺🇸",
  },
  {
    slug: "schengen-visa-photo",
    title: "Schengen Visa Photo",
    spec: "35×45 mm",
    flag: "🇪🇺",
  },
  {
    slug: "indian-passport-photo-maker",
    title: "Indian Passport & OCI",
    spec: "35×45 / 2×2″",
    flag: "🇮🇳",
  },
  {
    slug: "digital-passport-photo",
    title: "Digital Passport Photo",
    spec: "Online Upload",
    flag: "💻",
  },
  {
    slug: "photo-size-35x45mm",
    title: "35×45 mm Photo Size",
    spec: "Standard Ratio",
    flag: "📐",
  },
  {
    slug: "image-to-passport-size-converter",
    title: "Image to Passport Converter",
    spec: "Auto-Crop",
    flag: "🔄",
  },
  {
    slug: "passport-photo-at-home",
    title: "Passport Photo at Home",
    spec: "DIY & Print",
    flag: "🏠",
  },
  {
    slug: "passport-photo-tool",
    title: "Passport Photo Tool",
    spec: "50+ Countries",
    flag: "✂️",
  },
  {
    slug: "online-id-photo-maker",
    title: "Online ID Photo Maker",
    spec: "All ID Types",
    flag: "🪪",
  },
  {
    slug: "order-passport-photos-online",
    title: "Order Passport Photos",
    spec: "Digital & Prints",
    flag: "📦",
  },
];

export default function PassportSizePhotoMakerPage() {
  return (
    <>
      <JsonLd
        price="7.99"
        priceCurrency="GBP"
        description="Create official biometric passport size photos online with instant verification and printable 6x4 inch sheet."
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          {
            name: "Passport Size Photo Maker",
            url: `${SITE_URL}/passport-size-photo-maker`,
          },
        ]}
      />

      <Navbar ctaText="Home" ctaHref="/" />

      <main
        className="flex-1 bg-slate-50 min-h-screen py-6 sm:py-12 text-slate-900"
        id="main-content"
      >
        <div className="container-narrow max-w-3xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb & Header */}
          <div className="text-center mb-5 sm:mb-7">
            <nav
              className="text-xs text-slate-600 mb-2 flex justify-center"
              aria-label="Breadcrumb"
            >
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
                <li
                  className="text-slate-900 font-semibold"
                  aria-current="page"
                >
                  Passport Size Photo Maker
                </li>
              </ol>
            </nav>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Passport Photo Maker
            </h1>
            <p className="text-slate-700 text-xs sm:text-sm mt-1.5 max-w-md mx-auto leading-relaxed">
              Select your country, upload your photo, and let AI automatically size and verify biometrics in 10 seconds.
            </p>
          </div>

          {/* Unified Photo Maker Studio Component */}
          <PhotoMakerStudio
            defaultCountryCode="GB"
            defaultDocumentType="passport"
          />

          {/* Print Template Generator Feature Card */}
          <div className="mt-8 bg-gradient-to-br from-lime-900 via-slate-900 to-slate-900 border border-lime-600/40 rounded-2xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-lime-500/20 text-lime-300 font-mono text-[11px] font-bold uppercase tracking-wider mb-2 border border-lime-500/30">
                  Free 4×6″ &amp; A4 Print Sheets
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Need to print on 4×6″ (10×15 cm) paper?
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-lg leading-relaxed">
                  Tile multiple passport photos onto standard 4×6″ or A4 sheets with cutting guides. Save money at Boots, Tesco, or home printers.
                </p>
              </div>
              <Link
                href="/passport-photo-print-template-generator"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs sm:text-sm transition-colors shrink-0 shadow-sm"
              >
                <span>Open Print Generator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Popular Country & Document Formats Quick Links */}
          <div className="mt-10 pt-8 border-t border-slate-200">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 text-center mb-4">
              Explore Popular Country &amp; Document Guides
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {POPULAR_TOOL_LINKS.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tool/${tool.slug}`}
                  className="bg-white border border-slate-200 hover:border-lime-600 p-3.5 rounded-xl flex items-center justify-between text-xs transition-colors group shadow-2xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg shrink-0" aria-hidden="true">
                      {tool.flag}
                    </span>
                    <div className="min-w-0">
                      <span className="font-bold text-slate-900 block truncate group-hover:text-lime-900">
                        {tool.title}
                      </span>
                      <span className="text-slate-500 font-mono text-[11px]">
                        {tool.spec}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#4D7C0F] shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}