import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { HOW_TO_CATEGORIES, getAllHowToSummaries } from "@/lib/how-to";
import { TOOL_DIRECTORY } from "@/lib/tool-directory";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pixpassport.uk";

const PAGE_TITLE = "UK Passport Photo How-To Guides";
const PAGE_DESCRIPTION =
  "Step-by-step guides to taking, checking, uploading and printing a UK passport photo, written against GOV.UK and HM Passport Office photo rules.";

const categoryId = (category: string) =>
  `category-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

const CATEGORY_INTROS: Record<string, string> = {
  "Taking Your Photo":
    "Set up your space, light your face and take a photo that passes first time.",
  "Editing & Checking":
    "Fix common problems and check your photo against the official rules.",
  "Applying & Uploading":
    "Get your digital photo into a GOV.UK passport application.",
  Printing:
    "Print correctly sized photos at home or at a photo shop.",
};

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/how-to`,
    languages: {
      "en-GB": `${SITE_URL}/how-to`,
    },
  },
  openGraph: {
    title: `${PAGE_TITLE} — PixPassport`,
    description: PAGE_DESCRIPTION,
    url: `${SITE_URL}/how-to`,
    siteName: "PixPassport",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${PAGE_TITLE} — PixPassport`,
    description: PAGE_DESCRIPTION,
  },
};

/** How-to style pages that live under /tool, linked so the hub covers every guide. */
const TOOL_GUIDES = TOOL_DIRECTORY.filter((t) => t.group === "How-To Guides & Tools");

export default function HowToHubPage() {
  const guides = getAllHowToSummaries();
  const knownCategories: string[] = HOW_TO_CATEGORIES;
  const extraCategories = [
    ...new Set(guides.map((g) => g.category).filter((c) => !knownCategories.includes(c))),
  ];
  const categories = [...knownCategories, ...extraCategories].filter((category) =>
    guides.some((g) => g.category === category)
  );

  return (
    <>
      <JsonLd
        siteUrl={SITE_URL}
        pageUrl={`${SITE_URL}/how-to`}
        pageName={PAGE_TITLE}
        pageDescription={PAGE_DESCRIPTION}
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "How-To Guides", url: `${SITE_URL}/how-to` },
        ]}
        itemList={guides.map((g) => ({ name: g.title, url: `${SITE_URL}/how-to/${g.slug}` }))}
        includeOrganization={true}
        includeWebsite={true}
        includeWebApp={false}
      />

      <Navbar ctaText="Create Photo" ctaHref="/passport-size-photo-maker" />

      <main className="flex-1 bg-white text-slate-900" id="main-content">
        <section className="bg-slate-50/80 py-10 sm:py-16 border-b border-slate-200/80" aria-label="How-to guides header">
          <div className="container-narrow max-w-5xl">
            <nav className="text-xs text-slate-600 mb-4" aria-label="Breadcrumb">
              <ol className="flex items-center gap-1.5 list-none p-0 m-0">
                <li>
                  <Link href="/" className="text-slate-600 hover:text-lime-800 transition-colors font-medium">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-slate-900 font-semibold" aria-current="page">
                  How-To Guides
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight mb-4">
              {PAGE_TITLE}
            </h1>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-3xl">
              Practical, step-by-step help for every stage of getting a passport photo right, from
              setting up at home to uploading your photo to GOV.UK. Looking for the official size
              and rules instead? See the{" "}
              <Link href="/tool" className="font-bold underline text-[#365314] hover:text-[#4D7C0F]">
                passport and visa photo guides
              </Link>
              .
            </p>
          </div>
        </section>

        <div className="container-narrow max-w-5xl py-12 sm:py-16 space-y-12">
          {categories.map((category) => (
            <section key={category} aria-labelledby={categoryId(category)}>
              <h2
                id={categoryId(category)}
                className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-2"
              >
                {category}
              </h2>
              {CATEGORY_INTROS[category] && (
                <p className="text-slate-700 text-sm sm:text-base mb-6">{CATEGORY_INTROS[category]}</p>
              )}
              <ul className="grid sm:grid-cols-2 gap-4 list-none p-0 m-0">
                {guides
                  .filter((g) => g.category === category)
                  .map((g) => (
                    <li key={g.slug}>
                      <Link
                        href={`/how-to/${g.slug}`}
                        className="bg-white border border-slate-200 hover:border-lime-600 p-5 rounded-2xl flex items-start justify-between gap-3 transition-all group h-full"
                      >
                        <span className="flex items-start gap-3 min-w-0">
                          <span className="text-2xl shrink-0" aria-hidden="true">{g.icon}</span>
                          <span className="min-w-0">
                            <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-lime-900 transition-colors block">
                              {g.title}
                            </span>
                            <span className="text-xs sm:text-sm text-slate-600 leading-relaxed block mt-1">
                              {g.summary}
                            </span>
                            {g.reading_time && (
                              <span className="text-xs text-slate-500 font-mono block mt-2">{g.reading_time}</span>
                            )}
                          </span>
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#4D7C0F] shrink-0 mt-1" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          ))}

          {TOOL_GUIDES.length > 0 && (
            <section aria-labelledby="more-photo-guides">
              <h2
                id="more-photo-guides"
                className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-2"
              >
                More Photo Guides
              </h2>
              <p className="text-slate-700 text-sm sm:text-base mb-6">
                Guides with a built-in photo maker for taking, resizing and ordering your photo.
              </p>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0 m-0">
                {TOOL_GUIDES.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/tool/${t.slug}`}
                      className="bg-white border border-slate-200 hover:border-lime-600 p-5 rounded-2xl flex items-center justify-between transition-all group h-full"
                    >
                      <span className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl shrink-0" aria-hidden="true">{t.flag}</span>
                        <span className="min-w-0">
                          <span className="text-sm font-bold text-slate-900 group-hover:text-lime-900 transition-colors block">
                            {t.title}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">{t.spec}</span>
                        </span>
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#4D7C0F] shrink-0 ml-2" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-label="Create your photo" className="border-t border-slate-200 pt-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-2">
              Ready to Make Your Photo?
            </h2>
            <p className="text-slate-700 text-sm sm:text-base">
              Upload a photo to the{" "}
              <Link href="/passport-size-photo-maker" className="font-bold underline text-[#365314] hover:text-[#4D7C0F]">
                passport photo maker
              </Link>{" "}
              to crop, resize and check it, or test an existing photo with the{" "}
              <Link href="/tool/passport-photo-checker-uk" className="font-bold underline text-[#365314] hover:text-[#4D7C0F]">
                UK passport photo checker
              </Link>
              .
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
