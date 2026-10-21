import type { Metadata } from "next";
import Link from "next/link";
import {
  Printer,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Ruler,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import PrintTemplateGenerator from "@/components/PrintTemplateGenerator";
import FaqAccordion, { type FaqItem } from "@/components/FaqAccordion";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pixpassport.uk";

const PAGE_URL = `${SITE_URL}/print-passport-photos-at-home`;

export const metadata: Metadata = {
  title: "Print Passport Photos at Home: UK Guide & Free Template",
  description:
    "Print passport photos at home on A4 or 4×6″ paper. Free 300 DPI template, exact printer settings, phone and Word tips, and costs compared with kiosks and booths.",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      "en-GB": PAGE_URL,
    },
  },
  openGraph: {
    title: "Print Passport Photos at Home: Free UK Template & Guide — PixPassport",
    description:
      "Make a print-ready passport photo sheet for your home printer. Get the right settings, paper and cutting tips for exact 35×45 mm photos.",
    url: PAGE_URL,
    siteName: "PixPassport",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/pixpassport.jpg`,
        width: 640,
        height: 640,
        alt: "Print passport photos at home with a free A4 and 4×6 template — PixPassport",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Print Passport Photos at Home: UK Guide & Free Template",
    description:
      "Free 300 DPI passport photo sheet for home printers, plus the settings that keep every photo at exactly 35×45 mm.",
    images: [`${SITE_URL}/pixpassport.jpg`],
  },
};

const HOME_PRINT_FAQS: FaqItem[] = [
  {
    question: "Can I print my own passport photos at home in the UK?",
    answer:
      "Yes. HM Passport Office accepts photos you print yourself, provided they meet the rules: 35×45 mm, printed on photo-quality paper, sharp, unaltered and free of creases, borders or ink marks. Paper applications need two identical printed copies.",
  },
  {
    question: "How do I print a passport size photo at home?",
    answer:
      "Create a print sheet from a compliant photo, load photo paper, and print the file at 100% (Actual Size) with Fit to Page and borderless printing switched off. Let the ink dry, measure one photo at 35 mm wide by 45 mm tall, then cut along the crop marks.",
  },
  {
    question: "What paper should I use to print passport photos?",
    answer:
      "Use glossy or matte photo paper, ideally 180–260 gsm. Plain office paper is not accepted because the image looks dull and the ink can bleed. A4 and 4×6″ (10×15 cm) photo paper both work with the template above.",
  },
  {
    question: "What printer settings should I use for passport photos?",
    answer:
      "Set the scale to 100% or Actual Size, and turn off Fit to Page, Shrink to Fit and borderless printing. Choose the paper type that matches your photo paper and select the highest or Best print quality.",
  },
  {
    question: "Why are my printed passport photos the wrong size?",
    answer:
      "Your printer or image viewer has scaled the sheet. Print again with scaling at 100% and borderless printing off, because borderless mode slightly enlarges the image. Always measure one photo with a ruler: it should be exactly 35 mm wide and 45 mm tall.",
  },
  {
    question: "Can I use an inkjet or a laser printer?",
    answer:
      "Most modern colour inkjet printers give passport-quality results on photo paper. Let the print dry for a few minutes before you cut it. Laser printers on plain paper usually give poor skin tones, so avoid them.",
  },
  {
    question: "How many passport photos fit on an A4 or 4×6″ sheet?",
    answer:
      "An A4 sheet holds roughly 25 photos of 35×45 mm, depending on margins and cutting gaps. That is enough for a whole family or several applications. A 4×6″ sheet holds up to 8.",
  },
  {
    question: "How do I print a passport photo from my iPhone or Android phone?",
    answer:
      "Save the sheet to your Photos or Files app, then print through AirPrint or your Android print service. Check that the preview shows 100% or Actual Size, not Fit. If the dialog offers no scale option, send the file to a computer and print from there.",
  },
  {
    question: "How do I make a passport size photo in Microsoft Word?",
    answer:
      "Insert your photo, untick Lock Aspect Ratio under Layout > Size, and set it to 4.5 cm high by 3.5 cm wide. Copy and paste to fill the page, then print at 100% on photo paper. The sheet generator above saves you the manual layout and adds crop marks.",
  },
  {
    question: "How do I print a 2×2 inch photo on 4×6″ paper?",
    answer:
      "Six 2×2 inch photos fit a 4×6″ sheet exactly, in two columns and three rows. Create the photo with our US tool, place it on the sheet, and print at 100% with borderless printing off. Measure one photo to confirm it is 2 inches square.",
  },
  {
    question: "Do I need to print photos for an online passport renewal?",
    answer:
      "No. Online UK applications use a digital photo upload instead. Print at home only if you apply by post or need physical photos for a visa, driving licence or other ID.",
  },
  {
    question: "How do I print a digital passport photo?",
    answer:
      "Download the photo as a high-resolution JPEG or PNG, place it on a 4×6″ or A4 sheet at 300 DPI, and print it on photo paper at 100% scale. Never print from a small, compressed copy, because it will look soft.",
  },
  {
    question: "How much does it cost to print passport photos?",
    answer:
      "At home, one sheet of photo paper and a little ink costs well under £1 and gives you many copies. A 4×6″ kiosk print usually costs around 10p–25p. A photo booth often charges £10–£15 for four photos. Prices vary by shop, so check your local branch.",
  },
  {
    question: "How much is a passport photo printer?",
    answer:
      "You do not need one. A standard colour inkjet and photo paper are enough. Dedicated compact photo printers cost more than a basic inkjet and only suit people who print photos often.",
  },
  {
    question: "Can I print passport photos online and have them delivered?",
    answer:
      "Yes. Several online photo services print 4×6″ sheets and post them to you. Upload a correctly sized sheet, choose a glossy or lustre finish, and check the preview for any automatic cropping before you pay.",
  },
];

const PAPER_GUIDE = [
  {
    paper: "A4 glossy photo paper",
    photos: "Around 25 photos",
    tip: "Best for families and spare copies",
  },
  {
    paper: "4×6″ (10×15 cm) photo paper",
    photos: "Up to 8 UK photos",
    tip: "Fits most photo printer trays",
  },
  {
    paper: "Matte photo paper",
    photos: "Same as glossy",
    tip: "Reduces glare; use it only if smooth and unmarked",
  },
  {
    paper: "Plain office paper",
    photos: "—",
    tip: "Not accepted by HM Passport Office",
  },
];

const PRINTER_SETTINGS = [
  { setting: "Scale", value: "100% / Actual Size" },
  { setting: "Fit to Page / Shrink to Fit", value: "Off" },
  { setting: "Borderless printing", value: "Off (it enlarges the image)" },
  { setting: "Paper type", value: "Photo Paper Glossy or Matte" },
  { setting: "Print quality", value: "High / Best" },
  { setting: "Colour", value: "Colour (not greyscale)" },
];

const STEPS = [
  {
    n: "01",
    title: "Create your sheet",
    body: "Upload a compliant photo above, pick A4 or 4×6″ to match your paper, and download the 300 DPI JPEG or PNG.",
  },
  {
    n: "02",
    title: "Load photo paper",
    body: "Put glossy or matte photo paper in the tray with the printable side facing the way your printer manual shows.",
  },
  {
    n: "03",
    title: "Print at 100% scale",
    body: "Open the file, choose Actual Size, switch off Fit to Page and borderless, and print on High quality.",
  },
  {
    n: "04",
    title: "Measure and cut",
    body: "Let the ink dry, check that one photo measures 35×45 mm, then cut along the crop marks with a trimmer or sharp scissors.",
  },
];

const TROUBLESHOOTING = [
  {
    problem: "Photos print too large or too small",
    fix: "Reprint at 100% with Fit to Page and borderless off.",
  },
  {
    problem: "Skin tones look orange or pale",
    fix: "Select the correct photo paper type and turn off automatic colour correction.",
  },
  {
    problem: "Streaks or banding across the photo",
    fix: "Run a nozzle check and head clean, then reprint on High quality.",
  },
  {
    problem: "Ink smudges when you cut",
    fix: "Wait at least five minutes, or longer on glossy paper, before handling.",
  },
  {
    problem: "Photo looks soft or pixelated",
    fix: "Print from the original 300 DPI file, not a screenshot or messaging-app copy.",
  },
  {
    problem: "White edge or border on one side",
    fix: "Re-centre the sheet in the tray and keep borderless printing switched off.",
  },
];

const RELATED_TOOLS = [
  { href: "/passport-photo-print-template-generator", title: "Print Template Generator", spec: "4×6″ & A4 Sheets", flag: "🖨️" },
  { href: "/passport-size-photo-maker", title: "Passport Size Photo Maker", spec: "Crop & Check", flag: "✂️" },
  { href: "/tool/passport-photo-at-home", title: "Take a Passport Photo at Home", spec: "DIY Setup", flag: "🏠" },
  { href: "/tool/take-a-passport-photo-on-iphone", title: "Passport Photo on iPhone", spec: "Phone Guide", flag: "📱" },
  { href: "/tool/uk-passport-photo", title: "UK Passport Photo", spec: "35×45 mm", flag: "🇬🇧" },
  { href: "/tool/passport-renewal-photo-online", title: "UK Passport Renewal", spec: "Digital Code", flag: "🔄" },
  { href: "/tool/passport-photo-checker-uk", title: "Passport Photo Checker", spec: "Compliance Check", flag: "✅" },
  { href: "/tool/order-passport-photos-online", title: "Order Passport Photos Online", spec: "No Printer Needed", flag: "📦" },
  { href: "/tool/digital-passport-photo", title: "Digital Passport Photo", spec: "Online Upload", flag: "💻" },
  { href: "/tool/uk-baby-passport-photo", title: "UK Baby Passport Photo", spec: "Infant Rules", flag: "👶" },
  { href: "/tool/us-visa-photo-tool", title: "US Visa & Passport", spec: "2×2 inches", flag: "🇺🇸" },
  { href: "/tool/uk-driving-licence-photo", title: "UK Driving Licence", spec: "DVLA 35×45 mm", flag: "🚗" },
];

const TOC = [
  { href: "#generator", label: "Free print template" },
  { href: "#steps", label: "4 steps" },
  { href: "#printer-settings", label: "Printer settings" },
  { href: "#paper-and-rules", label: "Paper and UK rules" },
  { href: "#word-photoshop", label: "Word and Photoshop" },
  { href: "#two-by-two", label: "2×2 photos" },
  { href: "#no-printer", label: "No printer?" },
  { href: "#troubleshooting", label: "Troubleshooting" },
  { href: "#faq", label: "FAQs" },
];

const linkCls = "text-lime-800 font-semibold underline underline-offset-2";
const h2Cls =
  "text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-3";
const h3Cls = "text-xl font-bold text-slate-900 mb-2 mt-8";
const h4Cls = "text-base font-bold text-slate-900 mb-1 mt-5";
const pCls = "text-slate-600 text-sm sm:text-base leading-relaxed mb-4";

function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <CheckCircle2 className="w-4 h-4 mt-1 shrink-0 text-[#4D7C0F]" />
      <span>{children}</span>
    </li>
  );
}

export default function PrintPassportPhotosAtHomePage() {
  return (
    <>
      <JsonLd
        siteUrl={SITE_URL}
        siteName="PixPassport"
        appName="PixPassport Home Passport Photo Printing Template"
        appUrl={PAGE_URL}
        appId={`${PAGE_URL}#webapp`}
        description="Print passport photos at home. Free 300 DPI A4 and 4x6 inch passport photo sheet with crop marks, plus printer settings for exact 35x45 mm UK photos."
        price="0"
        priceCurrency="GBP"
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Photo Guides", url: `${SITE_URL}/tool` },
          { name: "Print Passport Photos at Home", url: PAGE_URL },
        ]}
        includeOrganization={false}
        includeWebsite={false}
        includeWebApp={true}
        faqItems={HOME_PRINT_FAQS}
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
                  <Link href="/tool" className="text-slate-600 hover:text-lime-800 transition-colors font-medium">
                    Photo Guides
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-slate-900 font-semibold truncate" aria-current="page">
                  Print Passport Photos at Home
                </li>
              </ol>
            </nav>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-[1.15] mb-2 sm:mb-3">
              How to Print Passport Photos at Home
            </h1>
            <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed mb-4">
              Upload your photo, choose <strong>A4</strong> or <strong>4×6″</strong> photo paper and download a 300 DPI sheet with crop marks. Then follow the printer settings below to get exact <strong>35×45 mm</strong> UK passport photos from your own printer.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-semibold text-slate-700">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                <Printer className="w-3.5 h-3.5 text-[#4D7C0F]" /> Home Printer Ready
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                <Ruler className="w-3.5 h-3.5 text-[#4D7C0F]" /> Exact 35×45 mm at 100%
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4D7C0F]" /> Free &amp; Private
              </span>
            </div>
          </div>
        </section>

        {/* 2. GENERATOR */}
        <section className="py-6 sm:py-10 bg-slate-50 border-b border-slate-200/80" id="generator">
          <div className="container-narrow max-w-6xl">
            <PrintTemplateGenerator initialPaperSize="a4" />
          </div>
        </section>

        {/* 3. QUICK ANSWER + TOC */}
        <section className="py-10 sm:py-14 bg-white border-b border-slate-200/80">
          <div className="container-narrow max-w-4xl">
            <h2 className={h2Cls}>The Short Answer: Print at 100% on Photo Paper</h2>
            <p className={pCls}>
              You can print UK passport photos at home with any colour printer. Use photo paper, print the sheet at <strong>100% (Actual Size)</strong>, and switch off <strong>Fit to Page</strong> and <strong>borderless printing</strong>. Measure one photo before you cut. It must be exactly <strong>35 mm wide and 45 mm tall</strong>.
            </p>

            <nav aria-label="On this page" className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
              <p className="text-sm font-bold text-slate-900 mb-2">On this page</p>
              <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
                {TOC.map((t) => (
                  <li key={t.href}>
                    <a
                      href={t.href}
                      className="inline-block px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-lime-600 hover:text-lime-900 transition-colors"
                    >
                      {t.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <h3 className={h3Cls}>What you need before you start</h3>
            <ul className="space-y-2 text-slate-600 text-sm sm:text-base leading-relaxed list-none p-0">
              <Check>A compliant photo. Check it first with the <Link href="/tool/passport-photo-checker-uk" className={linkCls}>passport photo checker</Link>, or crop it with the <Link href="/passport-size-photo-maker" className={linkCls}>passport size photo maker</Link>.</Check>
              <Check>A colour printer. Inkjet gives the best skin tones.</Check>
              <Check>Glossy or matte photo paper in A4 or 4×6″.</Check>
              <Check>A ruler, plus a paper trimmer or sharp scissors.</Check>
            </ul>
          </div>
        </section>

        {/* 4. STEPS */}
        <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200/80" id="steps">
          <div className="container-narrow max-w-5xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-block px-3 py-1 rounded-full bg-lime-100 border border-lime-300 text-[#4D7C0F] text-xs font-bold mb-3">
                Step-by-Step
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-3">
                Print Your Own Passport Photos in 4 Steps
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                The whole job takes about ten minutes, plus drying time.
              </p>
            </div>

            <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 list-none p-0">
              {STEPS.map((s) => (
                <li key={s.n} className="bg-white border border-slate-200 rounded-2xl p-6">
                  <div className="w-10 h-10 rounded-xl bg-lime-100 text-[#4D7C0F] font-bold flex items-center justify-center mb-4">
                    {s.n}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 5. PRINTER SETTINGS */}
        <section className="py-14 sm:py-20 bg-white border-b border-slate-200/80" id="printer-settings">
          <div className="container-narrow max-w-4xl">
            <h2 className={h2Cls}>The Right Printer Settings for Passport Photos</h2>
            <p className={pCls}>
              Most home-printed passport photos fail because the printer quietly resizes the image. These settings keep every photo at its true size on Windows, Mac and most HP, Canon, Epson and Brother printers.
            </p>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200">
                      <th scope="col" className="p-4 font-bold text-slate-900">Setting</th>
                      <th scope="col" className="p-4 font-bold text-slate-900">Choose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {PRINTER_SETTINGS.map((r) => (
                      <tr key={r.setting}>
                        <td className="p-4 font-semibold text-slate-900">{r.setting}</td>
                        <td className="p-4 text-slate-600">{r.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <h3 className={h3Cls}>Where to find these settings</h3>
            <h4 className={h4Cls}>Windows</h4>
            <p className={pCls}>
              Open the file, press Ctrl+P, choose Printer Properties, then set the paper type and quality. In the print dialog, select <strong>Full page photo</strong> and tick <strong>Fit picture to frame</strong> off.
            </p>
            <h4 className={h4Cls}>Mac</h4>
            <p className={pCls}>
              Press Cmd+P, open Show Details, and set Scale to 100%. Under Paper Handling, turn off Scale to fit paper. Pick your photo paper under Media &amp; Quality.
            </p>
            <h4 className={h4Cls}>Epson, Canon, HP and Brother</h4>
            <p className={pCls}>
              Each brand names its paper types differently, so match the label on your photo paper packet. Look for options such as Premium Glossy, Photo Paper Plus or Advanced Photo Paper, and always turn off any Expansion or Borderless setting.
            </p>

            <h3 className={h3Cls}>Print from a phone or tablet</h3>
            <h4 className={h4Cls}>iPhone (AirPrint)</h4>
            <p className={pCls}>
              Save the sheet to Photos or Files, tap Share, then Print. Check the preview carefully: pinching to zoom can change the size. If it looks cropped, print from a computer instead. Our guide to <Link href="/tool/take-a-passport-photo-on-iphone" className={linkCls}>taking a passport photo on iPhone</Link> covers the camera side.
            </p>
            <h4 className={h4Cls}>Android</h4>
            <p className={pCls}>
              Open the sheet in Google Photos or Files, tap Print, and pick your printer. Choose the matching paper size and, if offered, set scale to 100%.
            </p>

            <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5">
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-700 mt-0.5" />
              <p className="text-sm text-slate-700 leading-relaxed">
                <strong>Phone print dialogs often default to &quot;Fit&quot;.</strong> If you cannot find a 100% option, open the sheet in a PDF or photo app that offers one, or print from a computer.
              </p>
            </div>
          </div>
        </section>

        {/* 6. PAPER + UK RULES */}
        <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200/80" id="paper-and-rules">
          <div className="container-narrow max-w-4xl">
            <h2 className={h2Cls}>Which Paper Is Best for Home Passport Photos?</h2>
            <p className={pCls}>
              HM Passport Office asks for photos printed on photo-quality paper. Here is how the common options compare.
            </p>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-10">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200">
                      <th scope="col" className="p-4 font-bold text-slate-900">Paper</th>
                      <th scope="col" className="p-4 font-bold text-slate-900">Photos per sheet</th>
                      <th scope="col" className="p-4 font-bold text-slate-900">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {PAPER_GUIDE.map((r) => (
                      <tr key={r.paper}>
                        <td className="p-4 font-semibold text-slate-900">{r.paper}</td>
                        <td className="p-4 text-slate-600">{r.photos}</td>
                        <td className="p-4 text-slate-600">{r.tip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-3">UK rules for printed passport photos</h3>
            <ul className="space-y-2 text-slate-600 text-sm sm:text-base leading-relaxed list-none p-0">
              <Check>Each photo measures exactly <strong>35 mm wide × 45 mm tall</strong>.</Check>
              <Check>Head height runs <strong>29–34 mm</strong> from chin to crown.</Check>
              <Check>The photo is in colour on photo paper, sharp and in focus.</Check>
              <Check>The background is plain, light and free of shadows.</Check>
              <Check>There are no borders, creases, ink smudges or low-ink streaks.</Check>
              <Check>Paper applications include two identical copies.</Check>
            </ul>

            <p className={`${pCls} mt-6`}>
              Read the full size rules in our <Link href="/tool/uk-passport-photo" className={linkCls}>UK passport photo guide</Link> or see why the <Link href="/tool/photo-size-35x45mm" className={linkCls}>35×45 mm photo size</Link> matters. Applying for a child? Check the <Link href="/tool/uk-baby-passport-photo" className={linkCls}>baby passport photo rules</Link> first. Not taken your photo yet? Follow our guide to <Link href="/tool/passport-photo-at-home" className={linkCls}>taking a passport photo at home</Link>.
            </p>
          </div>
        </section>

        {/* 7. WORD + PHOTOSHOP */}
        <section className="py-14 sm:py-20 bg-white border-b border-slate-200/80" id="word-photoshop">
          <div className="container-narrow max-w-4xl">
            <h2 className={h2Cls}>Make a Passport Photo Sheet in Word or Photoshop</h2>
            <p className={pCls}>
              The generator above is the fastest route, because it sizes the photos and adds crop marks for you. If you prefer your own software, these steps give the same result.
            </p>

            <h3 className={h3Cls}>Microsoft Word</h3>
            <ol className="space-y-2 text-slate-600 text-sm sm:text-base leading-relaxed list-decimal pl-5 mb-4">
              <li>Insert your photo, then open Picture Format &gt; Size.</li>
              <li>Untick <strong>Lock aspect ratio</strong>, then enter 4.5 cm height and 3.5 cm width.</li>
              <li>Copy and paste the photo to fill the page, leaving a small gap between copies.</li>
              <li>Print on photo paper at 100%, then cut along the gaps.</li>
            </ol>
            <p className={pCls}>
              Word often adds margins and compresses images, so measure your first print before you cut the rest.
            </p>

            <h3 className={h3Cls}>Photoshop (4×6″ sheet)</h3>
            <ol className="space-y-2 text-slate-600 text-sm sm:text-base leading-relaxed list-decimal pl-5 mb-4">
              <li>Create a new 6×4 inch document at 300 pixels per inch with a white background.</li>
              <li>Crop your portrait to 35×45 mm at 300 ppi, with the head 29–34 mm tall.</li>
              <li>Drag copies onto the sheet, leaving gaps of about 2 mm for cutting.</li>
              <li>Choose Print, set Scale to 100%, and select your photo paper profile.</li>
            </ol>
            <p className={pCls}>
              Want to convert an existing picture without any software? Use the <Link href="/tool/image-to-passport-size-converter" className={linkCls}>image to passport size converter</Link>.
            </p>
          </div>
        </section>

        {/* 8. 2x2 */}
        <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200/80" id="two-by-two">
          <div className="container-narrow max-w-4xl">
            <h2 className={h2Cls}>Printing 2×2 Inch Photos at Home (US Passports and Visas)</h2>
            <p className={pCls}>
              US passports and visas use a square 2×2 inch (51×51 mm) photo instead of the UK 35×45 mm size. The printing rules stay the same: photo paper, 100% scale, no borders.
            </p>

            <h3 className={h3Cls}>How to print a 2×2 photo on 4×6″ paper</h3>
            <ol className="space-y-2 text-slate-600 text-sm sm:text-base leading-relaxed list-decimal pl-5 mb-4">
              <li>Create your photo with the <Link href="/tool/us-visa-photo-tool" className={linkCls}>US visa and passport photo tool</Link>.</li>
              <li>Place it on a 4×6″ sheet. Six photos fit exactly, in two columns and three rows.</li>
              <li>Print at 100% with borderless printing off.</li>
              <li>Measure one photo. It must be 2 inches square before you cut.</li>
            </ol>
            <p className={pCls}>
              Check the exact head size and background rules on the <Link href="/tool/us-visa-passport-photo-size" className={linkCls}>US visa photo size page</Link>.
            </p>

            <h3 className={h3Cls}>How to take a 2×2 photo on an iPhone</h3>
            <p className={pCls}>
              Stand facing a window in daylight, against a plain white wall. Ask a friend to hold the phone at eye level, or use the timer with the rear camera. Then open the photo in Photos, tap Edit &gt; Crop, and choose the square 1:1 ratio. Our <Link href="/tool/take-a-passport-photo-on-iphone" className={linkCls}>iPhone passport photo guide</Link> adds more tips.
            </p>

            <p className={pCls}>
              Other countries use different sizes. See guides for <Link href="/tool/indian-passport-photo-maker" className={linkCls}>Indian passport photos</Link>, <Link href="/tool/australian-passport-photo-uk" className={linkCls}>Australian passport photos</Link>, <Link href="/tool/schengen-visa-photo" className={linkCls}>Schengen visa photos</Link> and <Link href="/tool/uk-visa-photo" className={linkCls}>UK visa photos</Link>.
            </p>
          </div>
        </section>

        {/* 9. NO PRINTER */}
        <section className="py-14 sm:py-20 bg-white border-b border-slate-200/80" id="no-printer">
          <div className="container-narrow max-w-4xl">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-2">
                No Printer? Compare Home, Kiosk, Online and Photo Booth
              </h2>
              <p className="text-slate-600 text-sm">
                The same 4×6″ sheet prints at any high-street kiosk or online photo service.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200">
                      <th scope="col" className="p-4 sm:p-5 font-bold text-slate-900">Option</th>
                      <th scope="col" className="p-4 sm:p-5 font-bold text-lime-800 bg-lime-50/50">Home Printer</th>
                      <th scope="col" className="p-4 sm:p-5 font-bold text-slate-700">Kiosk or Online Print</th>
                      <th scope="col" className="p-4 sm:p-5 font-bold text-slate-700">Photo Booth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-4 sm:p-5 font-semibold text-slate-900">Cost</td>
                      <td className="p-4 sm:p-5 text-[#365314] font-bold bg-lime-50/30">Under £1 per sheet</td>
                      <td className="p-4 sm:p-5 text-slate-600">Around 10p – 25p per 4×6″</td>
                      <td className="p-4 sm:p-5 text-slate-600">Often £10 – £15</td>
                    </tr>
                    <tr>
                      <td className="p-4 sm:p-5 font-semibold text-slate-900">Photos</td>
                      <td className="p-4 sm:p-5 text-[#365314] font-bold bg-lime-50/30">Up to a full A4 page</td>
                      <td className="p-4 sm:p-5 text-slate-600">Up to 8 per 4×6″</td>
                      <td className="p-4 sm:p-5 text-slate-600">Usually 4</td>
                    </tr>
                    <tr>
                      <td className="p-4 sm:p-5 font-semibold text-slate-900">Speed</td>
                      <td className="p-4 sm:p-5 text-[#365314] font-bold bg-lime-50/30">Minutes, no travel</td>
                      <td className="p-4 sm:p-5 text-slate-600">Same day in store, or a few days by post</td>
                      <td className="p-4 sm:p-5 text-slate-600">Same day</td>
                    </tr>
                    <tr>
                      <td className="p-4 sm:p-5 font-semibold text-slate-900">Retakes</td>
                      <td className="p-4 sm:p-5 text-[#365314] font-bold bg-lime-50/30">Unlimited</td>
                      <td className="p-4 sm:p-5 text-slate-600">Unlimited</td>
                      <td className="p-4 sm:p-5 text-slate-600">A few rushed tries</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-center text-xs text-slate-500 mt-3">
              Prices vary by shop and change over time. Check your local branch before you go.
            </p>

            <h3 className={h3Cls}>Print passport photos online and get them delivered</h3>
            <p className={pCls}>
              Upload a correctly sized 4×6″ sheet to an online photo service and choose a glossy or lustre finish. Turn off any auto-crop or auto-enhance option, and check the preview so the service does not trim your crop marks. Our guide to <Link href="/tool/order-passport-photos-online" className={linkCls}>ordering passport photos online</Link> explains what to look for.
            </p>

            <h3 className={h3Cls}>Do I need a special passport photo printer?</h3>
            <p className={pCls}>
              No. A standard colour inkjet gives accurate results on photo paper. A dedicated photo printer only makes sense if you print photos often. For a one-off job, a kiosk print costs far less than buying new equipment.
            </p>

            <p className="text-center text-sm text-slate-600 mt-6">
              Printing at a kiosk? See the{" "}
              <Link href="/passport-photo-print-template-generator" className={linkCls}>
                4×6″ passport photo sheet guide
              </Link>
              .
            </p>
          </div>
        </section>

        {/* 10. TROUBLESHOOTING */}
        <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200/80" id="troubleshooting">
          <div className="container-narrow max-w-4xl">
            <h2 className={h2Cls}>Fix Common Home Printing Problems</h2>
            <p className={pCls}>
              A rejected photo costs you time and fees. Use this table to fix the most frequent faults before you send anything.
            </p>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200">
                      <th scope="col" className="p-4 font-bold text-slate-900">Problem</th>
                      <th scope="col" className="p-4 font-bold text-slate-900">Fix</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {TROUBLESHOOTING.map((r) => (
                      <tr key={r.problem}>
                        <td className="p-4 font-semibold text-slate-900">{r.problem}</td>
                        <td className="p-4 text-slate-600">{r.fix}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex gap-3 bg-lime-50 border border-lime-200 rounded-2xl p-4 sm:p-5">
              <Lightbulb className="w-5 h-5 shrink-0 text-[#4D7C0F] mt-0.5" />
              <p className="text-sm text-slate-700 leading-relaxed">
                <strong>Tip:</strong> print one test sheet on plain paper first. Hold it against a ruler to confirm the size, then use your photo paper for the final print.
              </p>
            </div>

            <h3 className={h3Cls}>Applying online? You may not need to print at all</h3>
            <p className={pCls}>
              Online UK passport applications use a digital photo upload, so skip the printer. Learn how it works in our guides to a <Link href="/tool/digital-passport-photo" className={linkCls}>digital passport photo</Link> and <Link href="/tool/passport-renewal-photo-online" className={linkCls}>online passport renewal photos</Link>. Need a photo for a licence? See the <Link href="/tool/uk-driving-licence-photo" className={linkCls}>UK driving licence photo</Link> guide.
            </p>
          </div>
        </section>

        {/* 11. FAQ */}
        <section className="py-14 sm:py-20 bg-white border-b border-slate-200/80" id="faq">
          <div className="container-narrow max-w-4xl">
            <FaqAccordion
              faqs={HOME_PRINT_FAQS}
              title="Printing Passport Photos at Home: FAQs"
            />
          </div>
        </section>

        {/* 12. RELATED TOOLS */}
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
                  key={t.href}
                  href={t.href}
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

            <p className="text-center text-sm text-slate-600 mt-8">
              Browse every guide in the{" "}
              <Link href="/tool" className={linkCls}>photo tools directory</Link>, or read{" "}
              <Link href="/data-security-privacy-safeguards" className={linkCls}>how we protect your photos</Link>.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}