import type { Metadata } from "next";
import Link from "next/link";
import {
  Scissors,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import PrintTemplateGenerator from "@/components/PrintTemplateGenerator";
import FaqAccordion, { type FaqItem } from "@/components/FaqAccordion";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pixpassport.uk";

export const metadata: Metadata = {
  title: "Passport Photo Sheet Maker: Free 4×6″ & A4 Print Template (UK)",
  description:
    "Free passport photo sheet maker for the UK. Convert your passport photo to 4x6 or A4, make 8 passport size photos online at 300 DPI and print for pence.",
  alternates: {
    canonical: `${SITE_URL}/passport-photo-print-template-generator`,
    languages: {
      "en-GB": `${SITE_URL}/passport-photo-print-template-generator`,
    },
  },
  openGraph: {
    title: "Free Passport Photo Sheet Maker (4×6″ & A4) — PixPassport",
    description:
      "Make 8 passport size photos online on one 4×6″ or A4 sheet. Calibrated 300 DPI with cutting guides. Print at Boots, Tesco, Asda or home for pence.",
    url: `${SITE_URL}/passport-photo-print-template-generator`,
    siteName: "PixPassport",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/pixpassport.jpg`,
        width: 1200,
        height: 630,
        alt: "Free passport photo sheet maker for 4×6 and A4 — PixPassport",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Passport Photo Sheet Maker (4×6″ & A4) — PixPassport",
    description:
      "Convert your passport photo to 4x6 free. Print-ready 300 DPI sheets for Boots, Tesco, Snappy Snaps and home printers.",
    images: [`${SITE_URL}/pixpassport.jpg`],
  },
};

const PRINT_FAQS: FaqItem[] = [
  {
    question: "How do I convert a passport photo to 4x6 for free?",
    answer:
      "Upload your photo to the generator above, choose 4×6″ and download the sheet. The tool tiles your photo into a grid at 1800×1200 px (300 DPI), so it is ready to print straight away. It is free, needs no sign-up and runs in your browser.",
  },
  {
    question: "How many passport photos fit on a 4×6 inch sheet?",
    answer:
      "A 4×6″ (10×15 cm) sheet holds up to 8 UK, EU and India photos (35×45 mm) with safe cutting margins. It also fits up to 4 US visa photos (2×2″) or 2 Canadian photos (50×70 mm).",
  },
  {
    question: "Can I make a passport size photo A4 sheet online?",
    answer:
      "Yes. Choose A4 in the generator to fill a full page with copies of your photo. This suits home printers and anyone who needs spare sets for a family application, a visa or a driving licence.",
  },
  {
    question: "Why should I avoid the 'Passport Photos' option at kiosks?",
    answer:
      "High-street booths and kiosks often charge £10 to £15 for their passport option. If you choose 'Standard 4×6″ Photo Print' and upload your PixPassport sheet, you get the same glossy 300 DPI print for around 10p to 25p.",
  },
  {
    question: "How do I make sure the printed photos are the right size?",
    answer:
      "Turn off 'Fit to Page' and 'Shrink to Fit', then print at 100% (Actual Size). Any scaling changes the photo dimensions and can cause a rejection. Measure one photo with a ruler before you cut the rest: it should read exactly 35×45 mm.",
  },
  {
    question: "What paper do UK passport photos need?",
    answer:
      "Print on photo-quality paper (gloss or matte) with no borders, creases or heavy texture. His Majesty's Passport Office rejects photos on plain office paper. The same rule applies to most visa authorities.",
  },
  {
    question: "Can I cut the photos myself?",
    answer:
      "Yes. Each sheet includes corner crop marks. Use sharp scissors, or a rotary trimmer and a metal ruler, and cut just outside each mark for clean 35×45 mm edges.",
  },
  {
    question: "Do I need printed photos for an online UK passport application?",
    answer:
      "No. Online applications ask you to upload one digital photo, so use our UK passport photo tool for that. Use the printed sheet for paper applications, visas, driving licences and other ID that needs physical copies.",
  },
];

const PAPER_SIZES = [
  {
    paper: "4×6″ (10×15 cm)",
    photos: "Up to 8 UK/EU (35×45 mm)",
    bestFor: "Kiosk and home printing",
  },
  {
    paper: "4×6″ (10×15 cm)",
    photos: "Up to 4 US (2×2″)",
    bestFor: "US visas and passports",
  },
  {
    paper: "A4 (210×297 mm)",
    photos: "Multiple full sets",
    bestFor: "Home printers and families",
  },
];

const RELATED_TOOLS = [
  { slug: "uk-passport-photo", title: "UK Passport Photo", spec: "35×45 mm", flag: "🇬🇧" },
  { slug: "passport-renewal-photo-online", title: "UK Passport Renewal", spec: "35×45 mm", flag: "🔄" },
  { slug: "us-visa-photo-tool", title: "US Visa & Passport", spec: "2×2 inches", flag: "🇺🇸" },
  { slug: "schengen-visa-photo", title: "Schengen Visa Photo", spec: "35×45 mm", flag: "🇪🇺" },
  { slug: "uk-baby-passport-photo", title: "UK Baby Passport Photo", spec: "HMPO Infant", flag: "👶" },
  { slug: "indian-passport-photo-maker", title: "Indian Passport & OCI", spec: "35×45 / 2×2″", flag: "🇮🇳" },
  { slug: "uk-driving-licence-photo", title: "UK Driving Licence", spec: "DVLA 35×45 mm", flag: "🚗" },
  { slug: "passport-photo-at-home", title: "Passport Photo at Home", spec: "DIY & Print", flag: "🏠" },
  { slug: "image-to-passport-size-converter", title: "Image to Passport Converter", spec: "Auto-Crop", flag: "🔄" },
];

export default function PrintTemplateGeneratorPage() {
  return (
    <>
      <JsonLd
        siteUrl={SITE_URL}
        siteName="PixPassport"
        description="Free passport photo sheet maker. Make 8 passport size photos online on a 4x6 inch or A4 sheet with cutting guides at 300 DPI."
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Photo Tools", url: `${SITE_URL}/passport-size-photo-maker` },
          {
            name: "Print Template Generator",
            url: `${SITE_URL}/passport-photo-print-template-generator`,
          },
        ]}
        includeWebApp={true}
        faqItems={PRINT_FAQS}
      />

      <Navbar ctaText="Photo Maker Studio" ctaHref="/passport-size-photo-maker" />

      <main className="flex-1 bg-slate-50 text-slate-900" id="main-content">
        {/* 1. HERO */}
        <section className="bg-white pt-6 pb-8 sm:pt-10 sm:pb-12 border-b border-slate-200/80">
          <div className="container-narrow max-w-4xl text-center">
            <nav className="text-xs text-slate-600 mb-3 sm:mb-4 flex justify-center" aria-label="Breadcrumb">
              <ol className="flex items-center gap-1.5 list-none p-0 m-0">
                <li>
                  <Link href="/" className="text-slate-600 hover:text-lime-800 transition-colors font-medium">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/passport-size-photo-maker" className="text-slate-600 hover:text-lime-800 transition-colors font-medium">
                    Photo Tools
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-slate-900 font-semibold truncate" aria-current="page">
                  Print Template Generator
                </li>
              </ol>
            </nav>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-[1.15] mb-2 sm:mb-3">
              Free Passport Photo Sheet Maker for 4×6″ and A4
            </h1>
            <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed mb-4">
              Convert your passport photo to 4x6 in seconds. Upload one photo, pick <strong>4×6″ (10×15 cm)</strong> or <strong>A4</strong>, and download a print-ready sheet with up to 8 passport size photos, cutting guides and calibrated 300 DPI quality.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-semibold text-slate-700">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#4D7C0F]" /> Calibrated 300 DPI
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                <Scissors className="w-3.5 h-3.5 text-[#4D7C0F]" /> Corner Crop Marks
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4D7C0F]" /> 100% Free &amp; In-Browser
              </span>
            </div>
          </div>
        </section>

        {/* 2. GENERATOR */}
        <section className="py-6 sm:py-10 bg-slate-50 border-b border-slate-200/80" id="generator">
          <div className="container-narrow max-w-6xl">
            <PrintTemplateGenerator />
          </div>
        </section>

        {/* 3. WHAT IT IS + BENEFITS */}
        <section className="py-14 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="container-narrow max-w-4xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-4">
              What Is a Passport Photo Sheet Maker?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
              A passport photo sheet maker tiles one photo into a grid on a single page. Instead of printing one 35×45 mm photo at a time, you print one sheet and cut out every copy. It is the quickest way to make 8 passport size photos online without paying booth prices.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              Whether you need a passport size photo A4 sheet for your home printer or a passport size 4×6 photo for your local kiosk, the generator sizes everything for you.
            </p>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Why UK applicants use it</h3>
            <ul className="space-y-2 text-slate-600 text-sm sm:text-base leading-relaxed list-none p-0">
              <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 mt-1 shrink-0 text-[#4D7C0F]" /><span><strong>You save money.</strong> Pay pence, not £10 or more.</span></li>
              <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 mt-1 shrink-0 text-[#4D7C0F]" /><span><strong>You get 8 photos.</strong> That covers a passport, a driving licence, a visa and spares.</span></li>
              <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 mt-1 shrink-0 text-[#4D7C0F]" /><span><strong>You print anywhere.</strong> Use Boots, Tesco, Asda, Superdrug, Snappy Snaps or your own printer.</span></li>
              <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 mt-1 shrink-0 text-[#4D7C0F]" /><span><strong>You keep control.</strong> Retake as often as you like, in good light, at home.</span></li>
            </ul>
          </div>
        </section>

        {/* 4. STEPS */}
        <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200/80">
          <div className="container-narrow max-w-5xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-block px-3 py-1 rounded-full bg-lime-100 border border-lime-300 text-[#4D7C0F] text-xs font-bold mb-3">
                High-Street Printing Secret
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-3">
                How to Print Passport Photos for 10p–25p
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Follow three steps to skip the £10–£15 booth fee and still get compliant prints.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  n: "01",
                  title: "Make your sheet",
                  body: (
                    <>
                      Upload your photo above, choose <strong>4×6″</strong> or <strong>A4</strong>, and download the 300 DPI JPEG to your phone or a USB stick.
                    </>
                  ),
                },
                {
                  n: "02",
                  title: "Order a standard 4×6″ print",
                  body: (
                    <>
                      At Boots, Tesco, Asda or Snappy Snaps, choose <strong>&quot;Standard Photo Prints (4×6″)&quot;</strong>. Do not press the pricier &quot;Passport Photo&quot; button.
                    </>
                  ),
                },
                {
                  n: "03",
                  title: "Cut along the crop marks",
                  body: (
                    <>
                      Collect your glossy print for about 15p. Cut along the corner marks to get up to 8 exact 35×45 mm photos.
                    </>
                  ),
                },
              ].map((s) => (
                <div key={s.n} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7">
                  <div className="w-10 h-10 rounded-xl bg-lime-100 text-[#4D7C0F] font-bold flex items-center justify-center mb-4">
                    {s.n}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. PAPER SIZES + UK RULES */}
        <section className="py-14 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="container-narrow max-w-4xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-3">
              4×6″ or A4: Which Sheet Should You Choose?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              Pick 4×6″ for cheap kiosk prints. Pick A4 if you would rather print at home or need several sets at once.
            </p>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-10">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200">
                      <th className="p-4 font-bold text-slate-900">Paper</th>
                      <th className="p-4 font-bold text-slate-900">Photos per sheet</th>
                      <th className="p-4 font-bold text-slate-900">Best for</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {PAPER_SIZES.map((r) => (
                      <tr key={r.paper + r.photos}>
                        <td className="p-4 font-semibold text-slate-900">{r.paper}</td>
                        <td className="p-4 text-slate-600">{r.photos}</td>
                        <td className="p-4 text-slate-600">{r.bestFor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-3">UK photo rules to check before you print</h3>
            <ul className="space-y-2 text-slate-600 text-sm sm:text-base leading-relaxed list-disc pl-5">
              <li>Print each photo at <strong>35×45 mm</strong>.</li>
              <li>Keep the head between <strong>29 mm and 34 mm</strong> from chin to crown.</li>
              <li>Use a plain, light background with no shadows.</li>
              <li>Print on photo paper, with no borders or creases.</li>
              <li>Print at <strong>100% scale</strong>, never &quot;Fit to Page&quot;.</li>
            </ul>
          </div>
        </section>

        {/* 6. COMPARISON TABLE */}
        <section className="py-14 sm:py-20 bg-slate-50/70 border-b border-slate-200/80">
          <div className="container-narrow max-w-4xl">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-2">
                Photo Booth vs. 4×6″ Print Template
              </h2>
              <p className="text-slate-600 text-sm">
                See why over 17,000 applicants use our printable sheets.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200">
                      <th className="p-4 sm:p-5 font-bold text-slate-900">Feature</th>
                      <th className="p-4 sm:p-5 font-bold text-lime-800 bg-lime-50/50">PixPassport 4×6″ Sheet</th>
                      <th className="p-4 sm:p-5 font-bold text-slate-700">High-Street Booth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-4 sm:p-5 font-semibold text-slate-900">Cost</td>
                      <td className="p-4 sm:p-5 text-[#365314] font-bold bg-lime-50/30">Free tool + 10p–25p print</td>
                      <td className="p-4 sm:p-5 text-slate-600">£10.00 – £15.00</td>
                    </tr>
                    <tr>
                      <td className="p-4 sm:p-5 font-semibold text-slate-900">Photos per sheet</td>
                      <td className="p-4 sm:p-5 text-[#365314] font-bold bg-lime-50/30">Up to 8</td>
                      <td className="p-4 sm:p-5 text-slate-600">Usually 4</td>
                    </tr>
                    <tr>
                      <td className="p-4 sm:p-5 font-semibold text-slate-900">Retakes</td>
                      <td className="p-4 sm:p-5 text-[#365314] font-bold bg-lime-50/30">Unlimited, at your own pace</td>
                      <td className="p-4 sm:p-5 text-slate-600">A few rushed attempts</td>
                    </tr>
                    <tr>
                      <td className="p-4 sm:p-5 font-semibold text-slate-900">Cutting guides</td>
                      <td className="p-4 sm:p-5 text-[#365314] font-bold bg-lime-50/30">Calibrated corner crop marks</td>
                      <td className="p-4 sm:p-5 text-slate-600">White borders, no marks</td>
                    </tr>
                    <tr>
                      <td className="p-4 sm:p-5 font-semibold text-slate-900">Digital copy</td>
                      <td className="p-4 sm:p-5 text-[#365314] font-bold bg-lime-50/30">Instant 300 DPI JPEG + PNG</td>
                      <td className="p-4 sm:p-5 text-slate-600">Often an extra fee</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* 7. FAQ */}
        <section className="py-14 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="container-narrow max-w-4xl">
            <FaqAccordion
              faqs={PRINT_FAQS}
              title="Passport Photo Sheet & 4×6 Printing FAQs"
            />
          </div>
        </section>

        {/* 8. RELATED TOOLS */}
        <section className="py-14 sm:py-20 bg-slate-50" aria-label="Explore other passport tools">
          <div className="container-narrow max-w-5xl">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="inline-block px-3 py-1 rounded-full bg-lime-100 border border-lime-300 text-[#4D7C0F] text-xs font-bold mb-2">
                Full Photo Suite
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Explore Other Passport Photo Tools
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {RELATED_TOOLS.map((t) => (
                <Link
                  key={t.slug}
                  href={`/tool/${t.slug}`}
                  className="bg-white border border-slate-200 hover:border-lime-600 p-4.5 sm:p-5 rounded-2xl flex items-center justify-between transition-all group shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl shrink-0" role="img" aria-hidden="true">{t.flag}</span>
                    <div>
                      <span className="text-sm font-bold text-slate-900 group-hover:text-lime-900 transition-colors block">
                        {t.title}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">{t.spec}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#4D7C0F] group-hover:translate-x-1 transition-all" />
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