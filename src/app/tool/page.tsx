import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { TOOL_DIRECTORY, TOOL_GROUPS } from "@/lib/tool-directory";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pixpassport.uk";

const PAGE_TITLE = "UK Passport & Visa Photo Guides";
const PAGE_DESCRIPTION =
  "Every PixPassport guide in one place: UK passport photo rules, renewals, baby photos, DVLA driving licence and UK visa photos, plus US, Schengen and Indian formats.";

const groupId = (group: string) =>
  `group-${group.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

const GROUP_INTROS: Record<string, string> = {
  "UK Passport Photos":
    "HM Passport Office rules for digital and printed photos, checked against GOV.UK.",
  "Other UK Documents":
    "Photo rules for DVLA driving licences and UK Visas and Immigration applications.",
  "Visas & Other Countries":
    "Photo sizes for visas and passports you might apply for from the UK.",
  "How-To Guides & Tools":
    "Take, resize, check and print your photo at home or on your phone.",
};

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/tool`,
    languages: {
      "en-GB": `${SITE_URL}/tool`,
    },
  },
  openGraph: {
    title: `${PAGE_TITLE} — PixPassport`,
    description: PAGE_DESCRIPTION,
    url: `${SITE_URL}/tool`,
    siteName: "PixPassport",
    locale: "en_GB",
    type: "website",
  },
};

export default function ToolHubPage() {
  return (
    <>
      <JsonLd
        siteUrl={SITE_URL}
        pageUrl={`${SITE_URL}/tool`}
        pageName={PAGE_TITLE}
        pageDescription={PAGE_DESCRIPTION}
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Photo Guides", url: `${SITE_URL}/tool` },
        ]}
        includeOrganization={false}
        includeWebsite={false}
        includeWebApp={false}
      />

      <Navbar ctaText="Create Photo" ctaHref="/passport-size-photo-maker" />

      <main className="flex-1 bg-white text-slate-900" id="main-content">
        <section className="bg-slate-50/80 py-10 sm:py-16 border-b border-slate-200/80" aria-label="Photo guides header">
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
                  Photo Guides
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight mb-4">
              {PAGE_TITLE}
            </h1>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-3xl">
              Find the right photo rules for your application. Each guide explains the official
              requirements for one document, with a photo maker to size and check your picture.
              Not sure where to start? Read the{" "}
              <Link href="/tool/uk-passport-photo" className="font-bold underline text-[#365314] hover:text-[#4D7C0F]">
                UK passport photo size and requirements
              </Link>{" "}
              guide.
            </p>
          </div>
        </section>

        <div className="container-narrow max-w-5xl py-12 sm:py-16 space-y-12">
          {TOOL_GROUPS.map((group) => (
            <section key={group} aria-labelledby={groupId(group)}>
              <h2
                id={groupId(group)}
                className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-2"
              >
                {group}
              </h2>
              <p className="text-slate-700 text-sm sm:text-base mb-6">{GROUP_INTROS[group]}</p>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0 m-0">
                {TOOL_DIRECTORY.filter((t) => t.group === group).map((t) => (
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
          ))}

          <section aria-label="Print sheets" className="border-t border-slate-200 pt-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-2">
              Printing Your Photos
            </h2>
            <p className="text-slate-700 text-sm sm:text-base">
              Already have a passport photo? Use the{" "}
              <Link href="/passport-photo-print-template-generator" className="font-bold underline text-[#365314] hover:text-[#4D7C0F]">
                passport photo print template generator
              </Link>{" "}
              to lay out copies on a 6×4″ sheet for a photo shop, or follow our guide to{" "}
              <Link href="/print-passport-photos-at-home" className="font-bold underline text-[#365314] hover:text-[#4D7C0F]">
                printing passport photos at home
              </Link>{" "}
              on your own printer.
            </p>
            <p className="text-slate-700 text-sm sm:text-base mt-3">
              Need help taking or uploading your photo? Browse our{" "}
              <Link href="/how-to" className="font-bold underline text-[#365314] hover:text-[#4D7C0F]">
                passport photo how-to guides
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
