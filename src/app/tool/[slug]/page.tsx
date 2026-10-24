import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import PhotoMakerStudio from "@/components/PhotoMakerStudio";
import PassportPhotoChecker from "@/components/PassportPhotoChecker";
import FaqAccordion from "@/components/FaqAccordion";
import GovUkPhotoNotice from "@/components/GovUkPhotoNotice";
import { getAllToolSlugs, getToolBySlug } from "@/lib/tools";
import { TOOL_DIRECTORY } from "@/lib/tool-directory";
import { getAllHowToSummaries } from "@/lib/how-to";
import {
  Sparkles,
  ArrowRight,
  Globe,
  Crop,
  Zap,
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllToolSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pixpassport.uk";

  return {
    title: tool.meta_title || tool.title,
    description: tool.meta_description,
    alternates: {
      canonical: `${siteUrl}/tool/${slug}`,
      languages: {
        "en-GB": `${siteUrl}/tool/${slug}`,
      },
    },
    openGraph: {
      title: `${tool.title} — PixPassport`,
      description: tool.meta_description,
      url: `${siteUrl}/tool/${slug}`,
      siteName: "PixPassport",
      locale: "en_GB",
      type: "website",
      images: [
        {
          url: tool.feature_image || `${siteUrl}/pixpassport.jpg`,
          alt: tool.feature_image_alt || `${tool.title} — PixPassport`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.title} — PixPassport`,
      description: tool.meta_description,
      images: [tool.feature_image || `${siteUrl}/pixpassport.jpg`],
    },
  };
}


export default async function DynamicToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pixpassport.uk";
  const primaryAnchor = tool.show_checker ? "#checker" : "#studio";

  // Guides that list this tool as related come first, so each page links to its most relevant how-tos.
  const allGuides = getAllHowToSummaries();
  const relatedGuides = [
    ...allGuides.filter((g) => g.related_tools.includes(slug)),
    ...allGuides.filter((g) => !g.related_tools.includes(slug)),
  ].slice(0, 3);

  return (
    <>
      <JsonLd
        siteUrl={siteUrl}
        siteName="PixPassport"
        appName={`PixPassport ${tool.hero_title || tool.title}`}
        appUrl={`${siteUrl}/tool/${slug}`}
        appId={`${siteUrl}/tool/${slug}#webapp`}
        description={tool.meta_description}
        price={tool.price || "7.99"}
        priceCurrency="GBP"
        pageUrl={`${siteUrl}/tool/${slug}`}
        pageName={tool.meta_title || tool.title}
        pageDescription={tool.meta_description}
        breadcrumbs={[
          { name: "Home", url: siteUrl },
          { name: "Photo Guides", url: `${siteUrl}/tool` },
          { name: tool.hero_title, url: `${siteUrl}/tool/${slug}` },
        ]}
        includeOrganization={false}
        includeWebsite={false}
        includeWebApp={true}
        faqItems={tool.faqs}
      />

      <Navbar ctaText={tool.show_checker ? "Check Photo" : "Create Photo"} ctaHref={primaryAnchor} />

      <main className="flex-1 bg-white text-slate-900" id="main-content">
        {/* =========================================================================
            1. HERO SECTION (Matching Homepage Design with Photo on Right)
           ========================================================================= */}
        <section className="bg-white py-10 sm:py-16 lg:py-20 border-b border-slate-200/80" id="hero" aria-label="Tool overview">
          <div className="container-narrow">
            {/* Breadcrumb Navigation */}
            <nav className="text-xs text-slate-600 mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center gap-1.5 list-none p-0 m-0">
                <li>
                  <Link href="/" className="text-slate-600 hover:text-lime-800 transition-colors font-medium">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">/</li>
                <li>
                  <Link href="/tool" className="text-slate-600 hover:text-lime-800 transition-colors font-medium">
                    Photo Guides
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">/</li>
                <li className="text-slate-900 font-semibold truncate max-w-[220px] sm:max-w-none" aria-current="page">
                  {tool.hero_title}
                </li>
              </ol>
            </nav>

            <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Copy Column */}
              <div className="lg:col-span-7 max-w-2xl">
                {/* Official Biometric Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4FBE8] border border-lime-300 text-xs font-bold text-[#365314] tracking-wide mb-5">
                  <span className="w-2 h-2 rounded-full bg-[#4D7C0F]" aria-hidden="true" />
                  <span>{tool.badge ? tool.badge.toUpperCase() : "OFFICIAL BIOMETRIC SPECIFICATION"}</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-3xl sm:text-3xl lg:text-[40px] font-extrabold text-[#0F172A] tracking-tight leading-[1.18] mb-3">
                  {tool.hero_title}
                </h1>

                {/* Body description */}
                <p className="text-sm sm:text-base text-[#334155] leading-relaxed mb-7 max-w-xl">
                  {tool.hero_subtitle}
                </p>

                {/* CTA Buttons - Scrolls smoothly to #studio */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5 mb-7">
                  <a
                    href={primaryAnchor}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#4D7C0F] hover:bg-[#3F650C] !text-white text-white font-bold text-base px-7 py-3.5 sm:py-4 rounded-xl transition-colors text-center shadow-xs cursor-pointer"
                  >
                    <span>{tool.cta_button_text || "Create My Passport Photo"}</span>
                    <span aria-hidden="true">&rarr;</span>
                  </a>
                  <a
                    href="#how-it-works"
                    className="w-full sm:w-auto inline-flex items-center justify-center bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base px-6 py-3.5 sm:py-4 rounded-xl border border-slate-300 transition-colors text-center"
                  >
                    How It Works
                  </a>
                </div>

                {/* Features Badges Row */}
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5">
                  <span className="inline-flex items-center justify-center sm:justify-start gap-1.5 px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 text-center">
                    <span aria-hidden="true">🔒</span> Secure &amp; Private
                  </span>
                  <span className="inline-flex items-center justify-center sm:justify-start gap-1.5 px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 text-center">
                    <span className="text-amber-600" aria-hidden="true">⚡</span> Results in 10s
                  </span>
                  <span className="inline-flex items-center justify-center sm:justify-start gap-1.5 px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 text-center">
                    <span aria-hidden="true">🌍</span> 50+ Countries
                  </span>
                  <span className="inline-flex items-center justify-center sm:justify-start gap-1.5 px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 text-center">
                    <span aria-hidden="true">🪪</span> Biometric Validation
                  </span>
                </div>
              </div>

              {/* Right Visual Preview Column (Matching Homepage with Feature Image) */}
              <div className="lg:col-span-5 flex items-center justify-center w-full">
                <div className="w-full max-w-sm lg:max-w-md">
                  <div className="p-2 sm:p-4 flex items-center justify-center">
                    <div className="relative w-full aspect-[4/5] max-h-[440px] flex items-center justify-center">
                      {tool.feature_image ? (
                        <Image
                          src={tool.feature_image}
                          alt={tool.feature_image_alt || `${tool.hero_title} Sample Biometric Preview`}
                          fill
                          priority
                          sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 420px"
                          className="object-contain"
                        />
                      ) : (
                        <Image
                          src="https://res.cloudinary.com/dipzpwbbk/image/upload/v1790507890/uk_passport_size_photo_i5uujz.jpg"
                          alt="Official UK Passport Size Photo Sample"
                          fill
                          priority
                          sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 420px"
                          className="object-contain"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            1b. IN-BROWSER PHOTO CHECKER (checker pages only)
           ========================================================================= */}
        {tool.show_checker && (
          <section className="bg-base-200 py-10 sm:py-16 border-b border-base-300" id="checker" aria-label="Passport photo checker">
            <div className="container-narrow max-w-5xl mx-auto px-4 sm:px-6">
              <PassportPhotoChecker
                defaultCountryCode={tool.country_code}
                defaultDocumentType={tool.document_type || "passport"}
                heading={tool.studio_title || "Passport Photo Checker"}
                description={tool.studio_description}
              />
            </div>
          </section>
        )}

        {/* =========================================================================
            2. PHOTO MAKER STUDIO SECTION (Placed directly below Hero Section)
           ========================================================================= */}
        <section className="bg-slate-50 py-10 sm:py-16 border-b border-slate-200/80" id="studio" aria-label="Photo Maker Studio">
          <div className="container-narrow max-w-2xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-5 sm:mb-7">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {tool.show_checker
                  ? "Fix Your Photo Automatically"
                  : tool.studio_title || `Create Your ${tool.hero_title}`}
              </h2>
              <p className="text-slate-700 text-xs sm:text-sm mt-1.5 max-w-md mx-auto leading-relaxed">
                {tool.show_checker
                  ? "Failed a check? Upload the same photo and we'll crop, resize and clean the background to the official rules."
                  : tool.studio_description ||
                    "Select your country, upload your photo, and let AI automatically size and verify biometrics in 10 seconds."}
              </p>
            </div>

            {/* Embedded Searchable Photo Maker Component */}
            <PhotoMakerStudio
              defaultCountryCode={tool.country_code}
              defaultDocumentType={tool.document_type || "passport"}
            />
            {tool.country_code === "GB" && tool.document_type === "passport" && (
              <GovUkPhotoNotice className="mt-5" />
            )}
          </div>
        </section>

        {/* =========================================================================
            3. 3-STEP PROCESS SECTION (Matching Homepage)
           ========================================================================= */}
        <section className="bg-white py-14 sm:py-20 border-b border-slate-200/80" id="how-it-works">
          <div className="container-narrow">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <span className="inline-block px-3 py-1 rounded-full bg-lime-100 border border-lime-300 text-[#4D7C0F] text-xs font-bold mb-3">
                Simple 3-Step Process
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-3">
                {tool.how_it_works_title || "How It Works in 3 Steps"}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Three steps take you from a regular phone photo to a correctly sized, checked photo.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-lime-600 transition-colors">
                <div>
                  <div className="flex items-center justify-between w-full mb-6">
                    <div className="w-12 h-12 rounded-xl bg-lime-50 border border-lime-200 flex items-center justify-center text-[#4D7C0F]">
                      <Globe className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                      Step 01
                    </span>
                  </div>
                  <h3 className="text-slate-900 text-lg sm:text-xl font-bold mb-2">
                    1. Select Your Country
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Pick from the UK, US, Schengen Area, India, or 50+ countries. We load the official biometric size automatically.
                  </p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-lime-600 transition-colors">
                <div>
                  <div className="flex items-center justify-between w-full mb-6">
                    <div className="w-12 h-12 rounded-xl bg-lime-50 border border-lime-200 flex items-center justify-center text-[#4D7C0F]">
                      <Crop className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                      Step 02
                    </span>
                  </div>
                  <h3 className="text-slate-900 text-lg sm:text-xl font-bold mb-2">
                    2. Upload and Auto-Crop
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Upload a clear, recent photo. The tool centres your face, sets the head size and checks the background and framing.
                  </p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-lime-600 transition-colors">
                <div>
                  <div className="flex items-center justify-between w-full mb-6">
                    <div className="w-12 h-12 rounded-xl bg-lime-50 border border-lime-200 flex items-center justify-center text-[#4D7C0F]">
                      <Zap className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                      Step 03
                    </span>
                  </div>
                  <h3 className="text-slate-900 text-lg sm:text-xl font-bold mb-2">
                    3. Preview and Download
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    In under 10 seconds you get a digital photo plus a print-ready 6×4″ sheet to upload or take to a photo shop for printing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. MARKDOWN CONTENT ARTICLE (Tables, Guidelines, Rules)
           ========================================================================= */}
        <section className="py-14 sm:py-20 bg-slate-50/70 border-b border-slate-200/80" aria-label="Official photo rules and submission guide">
          <div className="container-narrow max-w-4xl">
            <article className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-12 shadow-xs">
              <div
                className="markdown-content max-w-none"
                dangerouslySetInnerHTML={{ __html: tool.contentHtml }}
              />

              {/* Interactive FAQ Accordion UI */}
              {tool.faqs && tool.faqs.length > 0 && (
                <FaqAccordion
                  faqs={tool.faqs}
                  title={tool.hero_title || tool.title}
                />
              )}

              {/* In-Article CTA */}
              <div className="mt-12 pt-8 border-t border-slate-100 text-center bg-slate-50 rounded-2xl p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                  Ready to create your {tool.hero_title}?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-5 max-w-md mx-auto">
                  {tool.cta_description ||
                    "Prepare your photo using UK passport photo requirements and review it before submitting your application."}
                </p>
                <a
                  href="#studio"
                  className="inline-flex items-center justify-center gap-2 bg-[#4D7C0F] hover:bg-[#3F650C] !text-white text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl transition-all shadow-sm focus-ring cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Upload Photo &amp; Create Now</span>
                </a>
              </div>
            </article>
          </div>
        </section>

        {/* Step-by-step how-to guides (Internal Linking) */}
        {relatedGuides.length > 0 && (
          <section className="py-14 sm:py-16 bg-slate-50/70 border-b border-slate-200/80" aria-labelledby="related-how-to-guides">
            <div className="container-narrow max-w-5xl">
              <div className="flex items-end justify-between gap-4 mb-8">
                <h2 id="related-how-to-guides" className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                  Step-by-Step How-To Guides
                </h2>
                <Link href="/how-to" className="text-sm font-bold text-[#365314] hover:text-[#4D7C0F] underline shrink-0">
                  All guides
                </Link>
              </div>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0 m-0">
                {relatedGuides.map((g) => (
                  <li key={g.slug}>
                    <Link
                      href={`/how-to/${g.slug}`}
                      className="bg-white border border-slate-200 hover:border-lime-600 p-5 rounded-2xl flex items-start justify-between gap-3 transition-all group h-full"
                    >
                      <span className="flex items-start gap-3 min-w-0">
                        <span className="text-2xl shrink-0" aria-hidden="true">{g.icon}</span>
                        <span className="min-w-0">
                          <span className="text-sm font-bold text-slate-900 group-hover:text-lime-900 transition-colors block">
                            {g.title}
                          </span>
                          <span className="text-xs text-slate-600 leading-relaxed block mt-1">{g.summary}</span>
                        </span>
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#4D7C0F] shrink-0 mt-1" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* =========================================================================
            5. OTHER POPULAR PASSPORT & VISA TOOLS (Internal Linking SEO Grid)
           ========================================================================= */}
        <section className="py-14 sm:py-20 bg-white" aria-label="Explore other passport photo tools">
          <div className="container-narrow">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="inline-block px-3 py-1 rounded-full bg-lime-100 border border-lime-300 text-[#4D7C0F] text-xs font-bold mb-2">
                Biometric Standards &amp; Tools
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Explore Other Passport &amp; Visa Tools
              </h2>
              <p className="text-slate-600 text-sm mt-2">
                Official sizing rules, conversion tools, and DIY guides for all major document types.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TOOL_DIRECTORY.filter((t) => t.slug !== slug).map((t) => (
                <Link
                  key={t.slug}
                  href={`/tool/${t.slug}`}
                  className="bg-white border border-slate-200 hover:border-lime-600 p-4.5 sm:p-5 rounded-2xl flex items-center justify-between transition-all group shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl shrink-0" role="img" aria-hidden="true">{t.flag}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs font-semibold text-lime-800 bg-lime-50 px-1.5 py-0.5 rounded text-[10px]">
                          {t.group}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-slate-900 group-hover:text-lime-900 transition-colors block truncate">
                        {t.title}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {t.spec}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#4D7C0F] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
