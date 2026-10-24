import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import FaqAccordion from "@/components/FaqAccordion";
import PhotoMakerStudio from "@/components/PhotoMakerStudio";
import GovUkPhotoNotice from "@/components/GovUkPhotoNotice";
import { getAllHowToSlugs, getAllHowToSummaries, getHowToBySlug } from "@/lib/how-to";
import { TOOL_DIRECTORY, type ToolDirectoryEntry } from "@/lib/tool-directory";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pixpassport.uk";

const RELATED_LIMIT = 6;

// Only slugs with a markdown file exist; anything else is a hard 404.
export const dynamicParams = false;

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

export async function generateStaticParams() {
  return getAllHowToSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getHowToBySlug(slug);
  if (!guide) return {};

  const pageUrl = `${SITE_URL}/how-to/${slug}`;
  const image = guide.feature_image || `${SITE_URL}/pixpassport.jpg`;

  return {
    title: guide.meta_title || guide.title,
    description: guide.meta_description,
    alternates: {
      canonical: pageUrl,
      languages: {
        "en-GB": pageUrl,
      },
    },
    openGraph: {
      title: `${guide.title} — PixPassport`,
      description: guide.meta_description,
      url: pageUrl,
      siteName: "PixPassport",
      locale: "en_GB",
      type: "article",
      ...(guide.date_published ? { publishedTime: guide.date_published } : {}),
      ...(guide.date_modified ? { modifiedTime: guide.date_modified } : {}),
      section: guide.category,
      images: [{ url: image, alt: guide.feature_image_alt || `${guide.title} — PixPassport` }],
    },
    twitter: {
      // The fallback logo is square, so only use the large card with a real feature image.
      card: guide.feature_image ? "summary_large_image" : "summary",
      title: `${guide.title} — PixPassport`,
      description: guide.meta_description,
      images: [image],
    },
  };
}

export default async function HowToGuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = await getHowToBySlug(slug);

  if (!guide) {
    notFound();
  }

  const pageUrl = `${SITE_URL}/how-to/${slug}`;
  const ctaHref = guide.cta_href || (guide.show_studio ? "#studio" : "/passport-size-photo-maker");

  // Same-category guides first, then the rest, so every page links onward.
  const otherGuides = getAllHowToSummaries().filter((g) => g.slug !== slug);
  const relatedGuides = [
    ...otherGuides.filter((g) => g.category === guide.category),
    ...otherGuides.filter((g) => g.category !== guide.category),
  ].slice(0, RELATED_LIMIT);

  const relatedTools = guide.related_tools
    .map((toolSlug) => TOOL_DIRECTORY.find((t) => t.slug === toolSlug))
    .filter((t): t is ToolDirectoryEntry => t !== undefined);

  return (
    <>
      <JsonLd
        siteUrl={SITE_URL}
        pageUrl={pageUrl}
        pageName={guide.meta_title || guide.title}
        pageDescription={guide.meta_description}
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "How-To Guides", url: `${SITE_URL}/how-to` },
          { name: guide.hero_title, url: pageUrl },
        ]}
        article={{
          headline: guide.hero_title,
          description: guide.meta_description,
          imageUrl: guide.feature_image,
          datePublished: guide.date_published,
          dateModified: guide.date_modified,
        }}
        howTo={
          guide.steps
            ? {
                name: guide.hero_title,
                description: guide.meta_description,
                totalTime: guide.total_time,
                imageUrl: guide.feature_image,
                steps: guide.steps,
              }
            : undefined
        }
        faqItems={guide.faqs}
        includeOrganization={true}
        includeWebsite={true}
        includeWebApp={false}
      />

      <Navbar ctaText="Create Photo" ctaHref={ctaHref} />

      <main className="flex-1 bg-white text-slate-900" id="main-content">
        {/* Hero */}
        <section className="bg-slate-50/80 py-10 sm:py-16 border-b border-slate-200/80" aria-label="Guide overview">
          <div className="container-narrow max-w-4xl">
            <nav className="text-xs text-slate-600 mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center gap-1.5 list-none p-0 m-0">
                <li>
                  <Link href="/" className="text-slate-600 hover:text-lime-800 transition-colors font-medium">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">/</li>
                <li>
                  <Link href="/how-to" className="text-slate-600 hover:text-lime-800 transition-colors font-medium">
                    How-To Guides
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">/</li>
                <li className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-none" aria-current="page">
                  {guide.hero_title}
                </li>
              </ol>
            </nav>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4FBE8] border border-lime-300 text-xs font-bold text-[#365314] tracking-wide">
                <span aria-hidden="true">{guide.icon}</span>
                <span>{guide.category.toUpperCase()}</span>
              </span>
              {guide.reading_time && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  {guide.reading_time}
                </span>
              )}
              {guide.date_modified && (
                <span className="text-xs font-semibold text-slate-600">
                  Updated <time dateTime={guide.date_modified}>{formatDate(guide.date_modified)}</time>
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0F172A] tracking-tight leading-[1.15] mb-4">
              {guide.hero_title}
            </h1>
            {guide.hero_subtitle && (
              <p className="text-base sm:text-lg text-[#334155] leading-relaxed max-w-3xl">
                {guide.hero_subtitle}
              </p>
            )}

            {guide.show_studio && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-7">
                <a
                  href="#studio"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#4D7C0F] hover:bg-[#3F650C] !text-white text-white font-bold text-base px-7 py-3.5 rounded-xl transition-colors text-center shadow-xs"
                >
                  <span>{guide.cta_button_text || "Create My Passport Photo"}</span>
                  <span aria-hidden="true">&rarr;</span>
                </a>
                <a
                  href="#guide"
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base px-6 py-3.5 rounded-xl border border-slate-300 transition-colors text-center"
                >
                  Read the Guide
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Photo maker studio */}
        {guide.show_studio && (
          <section className="bg-base-200 py-10 sm:py-16 border-b border-base-300" id="studio" aria-labelledby="studio-heading">
            <div className="container-narrow max-w-2xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-5 sm:mb-7">
                <h2 id="studio-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {guide.studio_title || "Create Your Passport Photo"}
                </h2>
                <p className="text-slate-700 text-xs sm:text-sm mt-1.5 max-w-md mx-auto leading-relaxed">
                  {guide.studio_description ||
                    "Upload your photo and we'll crop it to the right size, clean the background and check it against the official rules."}
                </p>
              </div>

              <PhotoMakerStudio
                defaultCountryCode={guide.country_code}
                defaultDocumentType={guide.document_type}
              />
              {guide.country_code === "GB" && guide.document_type === "passport" && (
                <GovUkPhotoNotice className="mt-5" />
              )}
            </div>
          </section>
        )}

        {/* Article */}
        <section className="py-12 sm:py-16 bg-white border-b border-slate-200/80 scroll-mt-20" id="guide" aria-label="Guide content">
          <div className="container-narrow max-w-4xl">
            <article>
              {guide.feature_image && (
                <figure className="relative w-full aspect-[16/9] mb-10 rounded-3xl overflow-hidden border border-slate-200 bg-slate-50">
                  <Image
                    src={guide.feature_image}
                    alt={guide.feature_image_alt || guide.hero_title}
                    fill
                    priority
                    sizes="(max-width: 896px) 100vw, 896px"
                    className="object-cover"
                  />
                </figure>
              )}

              <div
                className="markdown-content max-w-none"
                dangerouslySetInnerHTML={{ __html: guide.contentHtml }}
              />

              {guide.faqs && guide.faqs.length > 0 && (
                <FaqAccordion faqs={guide.faqs} title={guide.hero_title} />
              )}

              <div className="mt-12 pt-8 border-t border-slate-100 text-center bg-slate-50 rounded-2xl p-6 sm:p-8">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                  {guide.cta_title || "Turn your photo into a passport photo"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mb-5 max-w-md mx-auto">
                  {guide.cta_description ||
                    "Upload your picture and we'll crop it to 35×45 mm, clean the background and check it against the official rules."}
                </p>
                <Link
                  href={ctaHref}
                  className="inline-flex items-center justify-center gap-2 bg-[#4D7C0F] hover:bg-[#3F650C] !text-white text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl transition-all shadow-sm focus-ring"
                >
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  <span>{guide.cta_button_text || "Create My Passport Photo"}</span>
                </Link>
              </div>
            </article>
          </div>
        </section>

        {/* Related tools */}
        {relatedTools.length > 0 && (
          <section className="py-14 sm:py-20 bg-white border-b border-slate-200/80" aria-labelledby="related-tools">
            <div className="container-narrow max-w-5xl">
              <div className="flex items-end justify-between gap-4 mb-8">
                <h2 id="related-tools" className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                  Tools &amp; Rules for This Guide
                </h2>
                <Link href="/tool" className="text-sm font-bold text-[#365314] hover:text-[#4D7C0F] underline shrink-0">
                  All photo tools
                </Link>
              </div>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0 m-0">
                {relatedTools.map((t) => (
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
            </div>
          </section>
        )}

        {/* Related guides */}
        {relatedGuides.length > 0 && (
          <section className="py-14 sm:py-20 bg-slate-50/70" aria-labelledby="related-guides">
            <div className="container-narrow max-w-5xl">
              <div className="flex items-end justify-between gap-4 mb-8">
                <h2 id="related-guides" className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                  More How-To Guides
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
                      className="bg-white border border-slate-200 hover:border-lime-600 p-5 rounded-2xl flex items-center justify-between transition-all group h-full"
                    >
                      <span className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl shrink-0" aria-hidden="true">{g.icon}</span>
                        <span className="min-w-0">
                          <span className="text-[10px] font-semibold text-lime-800 bg-lime-50 px-1.5 py-0.5 rounded inline-block mb-1">
                            {g.category}
                          </span>
                          <span className="text-sm font-bold text-slate-900 group-hover:text-lime-900 transition-colors block">
                            {g.title}
                          </span>
                        </span>
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#4D7C0F] shrink-0 ml-2" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
