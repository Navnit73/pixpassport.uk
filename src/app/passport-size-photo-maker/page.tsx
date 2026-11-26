import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import PhotoMakerStudio from "@/components/PhotoMakerStudio";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pixpassport.uk";

const PAGE_TITLE = "Passport Size Photo Maker UK – Make a Passport Photo Online";
const PAGE_H1 = "Passport Size Photo Maker: Make a UK Passport Photo Online";
const PAGE_DESCRIPTION =
  "Make a passport size photo online: 35×45 mm UK, US 2×2 and 50+ countries. Background replaced, head size checked. Preview free, download £7.99.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/passport-size-photo-maker`,
    languages: {
      "en-GB": `${SITE_URL}/passport-size-photo-maker`,
    },
  },
  openGraph: {
    title: `${PAGE_TITLE} — PixPassport`,
    description:
      PAGE_DESCRIPTION,
    url: `${SITE_URL}/passport-size-photo-maker`,
    siteName: "PixPassport",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/pixpassport.jpg`,
        width: 640,
        height: 640,
        alt: "Passport Photo Maker — PixPassport",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: `${PAGE_TITLE} — PixPassport`,
    description:
      PAGE_DESCRIPTION,
    images: [`${SITE_URL}/pixpassport.jpg`],
  },
};

const POPULAR_TOOL_LINKS = [
  { slug: "uk-passport-photo", title: "UK Passport Photo", spec: "35×45 mm", flag: "🇬🇧" },
  { slug: "passport-renewal-photo-online", title: "UK Passport Renewal", spec: "35×45 mm", flag: "🔄" },
  { slug: "uk-baby-passport-photo", title: "UK Baby Passport Photo", spec: "HMPO Infant", flag: "👶" },
  { slug: "uk-driving-licence-photo", title: "UK Driving Licence", spec: "DVLA 35×45 mm", flag: "🚗" },
  { slug: "us-visa-photo-tool", title: "US Visa & Passport", spec: "2×2 inches", flag: "🇺🇸" },
  { slug: "schengen-visa-photo", title: "Schengen Visa Photo", spec: "35×45 mm", flag: "🇪🇺" },
  { slug: "indian-passport-photo-maker", title: "Indian Passport & OCI", spec: "35×45 / 2×2″", flag: "🇮🇳" },
  { slug: "digital-passport-photo", title: "Digital Photo for Passport", spec: "GOV.UK Upload", flag: "💻" },
  { slug: "photo-size-35x45mm", title: "35×45 mm Photo Size", spec: "Standard Ratio", flag: "📐" },
  { slug: "image-to-passport-size-converter", title: "Image to Passport Converter", spec: "Auto-Crop", flag: "🔄" },
  { slug: "passport-photo-at-home", title: "Passport Photo at Home", spec: "DIY & Print", flag: "🏠" },
  { slug: "take-a-passport-photo-on-iphone", title: "iPhone Passport Photo", spec: "iOS Shoot Guide", flag: "📱" },
  { slug: "passport-photo-tool", title: "Passport Photo Tool", spec: "50+ Countries", flag: "✂️" },
  { slug: "online-id-photo-maker", title: "ID Card Photo Maker", spec: "Work, Student, CSCS", flag: "🪪" },
  { slug: "order-passport-photos-online", title: "Print Passport Photos Online", spec: "6×4″ Sheet", flag: "📦" },
  { slug: "passport-photo-checker-uk", title: "UK Passport Photo Checker", spec: "Free Check", flag: "✅" },
];

// ---- Guide article (inlined) ----
const FAQS = [
  { question: "How do I make a passport size photo online?", answer: "Choose your country and document, upload a clear front-facing photo, and the maker crops it to the right size, replaces the background and checks your head size. Preview the result free, then download the digital photo and a 6×4″ print sheet for £7.99." },
  { question: "What size is a UK passport size photo?", answer: "A printed UK passport photo is 35 mm wide and 45 mm high, with the head 29 mm to 34 mm from chin to crown. A digital photo for an online application must be at least 600 × 750 pixels." },
  { question: "Can I make a passport photo from a picture on my phone?", answer: "Yes, if it is recent, sharp, evenly lit and taken straight on with a neutral expression. Ask someone to take it at eye level rather than using a close-up selfie." },
  { question: "Is the passport photo maker free?", answer: "Uploading, cropping, checking and previewing are free. Downloading the finished digital photo and print sheet costs £7.99, with no watermark." },
  { question: "Can I print my passport photos after making them online?", answer: "Yes. The download includes a 6×4″ sheet you can print at Boots, Asda, Tesco or another photo kiosk, or at home on glossy photo paper at 100% scale." },
  { question: "Does the maker work for US 2×2 inch and Schengen photos?", answer: "Yes. Pick the country and document in the studio and it loads the correct size, such as 2 × 2 inches for US visas or 35 × 45 mm for Schengen visas." },
  { question: "Will my passport photo definitely be accepted?", answer: "No tool can promise that. HM Passport Office or the relevant authority makes the final decision, but correct sizing, a plain background and a check before you submit avoid the most common rejections." },
];

const h2Class = "text-xl sm:text-2xl font-bold text-base-content tracking-tight mt-10 mb-3";
const h3Class = "text-base sm:text-lg font-semibold text-base-content mt-6 mb-2";
const pClass = "text-base-content/80 text-sm sm:text-base leading-relaxed mb-4";
const listClass = "pl-5 mb-4 space-y-1.5 text-base-content/80 text-sm sm:text-base leading-relaxed";
const linkClass = "font-medium text-primary underline hover:text-secondary";
const thClass = "px-3 py-2 font-semibold text-base-content";
const tdClass = "px-3 py-2 text-base-content/80";

const SIZE_ROWS = [
  { doc: "UK passport", href: "/tool/uk-passport-photo", size: "35 × 45 mm", digital: "At least 600 × 750 px", bg: "Plain, light grey or cream" },
  { doc: "UK driving licence", href: "/tool/uk-driving-licence-photo", size: "35 × 45 mm", digital: "Passport photo reused or uploaded", bg: "Plain, light-coloured" },
  { doc: "Schengen visa", href: "/tool/schengen-visa-photo", size: "35 × 45 mm", digital: "Varies by consulate", bg: "Plain, light" },
  { doc: "US passport and visa", href: "/tool/us-visa-photo-tool", size: "2 × 2 in (51 × 51 mm)", digital: "600 × 600 to 1200 × 1200 px", bg: "White or off-white" },
  { doc: "Indian passport and OCI", href: "/tool/indian-passport-photo-maker", size: "35 × 45 mm or 2 × 2 in", digital: "Depends on the form", bg: "White" },
  { doc: "Australian passport", href: "/tool/australian-passport-photo-uk", size: "35–40 × 45–50 mm", digital: "Not applicable", bg: "Plain, light" },
];

const INTENT_LINKS = [
  { need: "A digital photo for a GOV.UK online application or renewal", href: "/tool/digital-passport-photo", label: "Digital photo for passport" },
  { need: "Printed photos for a paper form, printed at Boots, Asda or Tesco", href: "/tool/order-passport-photos-online", label: "Print passport photos online" },
  { need: "To check a photo you already have against the UK rules", href: "/tool/passport-photo-checker-uk", label: "UK passport photo checker" },
  { need: "To crop or resize an image to exactly 35 × 45 mm", href: "/tool/photo-size-35x45mm", label: "35×45 mm photo resizer" },
  { need: "A staff, student, CSCS or CitizenCard photo", href: "/tool/online-id-photo-maker", label: "ID photo maker" },
  { need: "A new photo on your driving licence", href: "/how-to/change-dvla-photo", label: "Change your DVLA photo" },
];

function ArticleContent() {
  return (
    <article
      className="mt-10 pt-8 border-t border-base-300"
      aria-label="Passport size photo maker guide"
    >
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-wider text-primary text-center mb-4">
          UK Passport Photo Maker Guide
        </p>
        <p className="text-base-content text-base sm:text-lg font-medium leading-relaxed mb-4">
          {"Our passport size photo maker turns a phone picture into a correctly sized passport photo in about 10 seconds. It crops your face to the official frame, replaces the background with plain light grey, checks your head size, and gives you a digital photo for online applications plus a 6×4″ sheet for printing."}
        </p>
        <p className={pClass}>
          {"It is set up for UK passports (35 × 45 mm) by default, and also covers US 2 × 2 inch photos, Schengen visas and 50+ other countries. Preview is free; the download costs £7.99, which is less than most photo booths."}
        </p>

        <h2 className={h2Class}>{"How to Make a Passport Size Photo Online"}</h2>
        <ol className={`list-decimal ${listClass}`}>
          <li><strong className="font-semibold text-base-content">{"Take a photo."}</strong>{" Stand in front of a plain wall facing a window and ask someone to take the photo at eye level, about a metre away."}</li>
          <li><strong className="font-semibold text-base-content">{"Choose your country and document."}</strong>{" The studio above starts on UK passport. Change it for a visa, driving licence or another country."}</li>
          <li><strong className="font-semibold text-base-content">{"Upload your picture."}</strong>{" The maker finds your face, crops to the right ratio and sets the head size."}</li>
          <li><strong className="font-semibold text-base-content">{"Review the checks."}</strong>{" Background, head size and framing are tested. Retake as often as you like."}</li>
          <li><strong className="font-semibold text-base-content">{"Download."}</strong>{" Get the digital photo and the 6×4″ print sheet, with no watermark."}</li>
        </ol>

        <h2 className={h2Class}>{"Passport Photo Sizes by Country"}</h2>
        <p className={pClass}>{"The maker loads these sizes automatically. Always confirm the current rules on the official site for your document."}</p>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left text-xs sm:text-sm border border-base-300 bg-base-100">
            <thead className="bg-base-200">
              <tr>
                <th scope="col" className={thClass}>{"Document"}</th>
                <th scope="col" className={thClass}>{"Print size"}</th>
                <th scope="col" className={thClass}>{"Digital"}</th>
                <th scope="col" className={thClass}>{"Background"}</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_ROWS.map((row) => (
                <tr key={row.doc} className="border-t border-base-300">
                  <td className={tdClass}><Link href={row.href} className={linkClass}>{row.doc}</Link></td>
                  <td className={tdClass}>{row.size}</td>
                  <td className={tdClass}>{row.digital}</td>
                  <td className={tdClass}>{row.bg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className={h2Class}>{"What the Passport Photo Maker Checks"}</h2>
        <ul className={`list-disc ${listClass}`}>
          <li><strong className="font-semibold text-base-content">{"Size and ratio:"}</strong>{" 35 × 45 mm (7:9) for the UK, or the exact format for your country."}</li>
          <li><strong className="font-semibold text-base-content">{"Head size:"}</strong>{" chin to crown between 29 mm and 34 mm on a UK print."}</li>
          <li><strong className="font-semibold text-base-content">{"Background:"}</strong>{" replaced with a plain, even light grey with no shadows."}</li>
          <li><strong className="font-semibold text-base-content">{"Framing:"}</strong>{" face centred, with space above the crown and the shoulders in shot."}</li>
          <li><strong className="font-semibold text-base-content">{"Resolution:"}</strong>{" exported at 600 DPI, well above the GOV.UK minimum of 600 × 750 pixels."}</li>
        </ul>
        <p className={pClass}>{"The maker cannot fix shadows on your face, closed eyes, a smile or glare on glasses. If you see any of these, retake the photo."}</p>

        <h2 className={h2Class}>{"Passport Photo Online vs Photo Booth vs Shop"}</h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left text-xs sm:text-sm border border-base-300 bg-base-100">
            <thead className="bg-base-200">
              <tr>
                <th scope="col" className={thClass}>{""}</th>
                <th scope="col" className={thClass}>{"PixPassport online"}</th>
                <th scope="col" className={thClass}>{"Photo booth"}</th>
                <th scope="col" className={thClass}>{"High-street shop"}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-base-300"><td className={tdClass}>{"Typical cost"}</td><td className={tdClass}>{"Free preview, £7.99 download"}</td><td className={tdClass}>{"Usually around £7 to £10"}</td><td className={tdClass}>{"Usually around £10 to £15"}</td></tr>
              <tr className="border-t border-base-300"><td className={tdClass}>{"Retakes"}</td><td className={tdClass}>{"Unlimited"}</td><td className={tdClass}>{"Limited per session"}</td><td className={tdClass}>{"Depends on the shop"}</td></tr>
              <tr className="border-t border-base-300"><td className={tdClass}>{"Digital photo"}</td><td className={tdClass}>{"Included"}</td><td className={tdClass}>{"Only with a photo code option"}</td><td className={tdClass}>{"Sometimes extra"}</td></tr>
              <tr className="border-t border-base-300"><td className={tdClass}>{"Printed photos"}</td><td className={tdClass}>{"6×4″ sheet to print anywhere"}</td><td className={tdClass}>{"Included"}</td><td className={tdClass}>{"Included"}</td></tr>
              <tr className="border-t border-base-300"><td className={tdClass}>{"Travel"}</td><td className={tdClass}>{"None"}</td><td className={tdClass}>{"To a booth"}</td><td className={tdClass}>{"To a branch"}</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className={h2Class}>{"Which Passport Photo Do You Need?"}</h2>
        <p className={pClass}>{"The studio above handles all of these. If you want a page focused on one job, start here:"}</p>
        <ul className={`list-disc ${listClass}`}>
          {INTENT_LINKS.map((item) => (
            <li key={item.href}>
              {item.need}{": "}
              <Link href={item.href} className={linkClass}>{item.label}</Link>
            </li>
          ))}
        </ul>

        <h2 className={h2Class}>{"Common Passport Photo Mistakes to Avoid"}</h2>
        <ul className={`list-disc ${listClass}`}>
          <li><strong className="font-semibold text-base-content">{"Wrong size:"}</strong>{" using 2 × 2 inches for a document that needs 35 × 45 mm."}</li>
          <li><strong className="font-semibold text-base-content">{"Shadows and glare:"}</strong>{" from a flash, a lamp to one side or glasses."}</li>
          <li><strong className="font-semibold text-base-content">{"Selfie distortion:"}</strong>{" a close-up phone selfie makes the nose look larger. Ask someone else to take it."}</li>
          <li><strong className="font-semibold text-base-content">{"Filters and retouching:"}</strong>{" beauty mode and smoothing lead to refusal."}</li>
          <li><strong className="font-semibold text-base-content">{"Smiling or tilting your head:"}</strong>{" keep a neutral expression, facing the camera."}</li>
          <li><strong className="font-semibold text-base-content">{"An old photo:"}</strong>{" GOV.UK needs a photo taken in the last month."}</li>
        </ul>
        <p className={pClass}>
          {"See the full list in "}
          <Link href="/how-to/passport-photo-rejected-uk" className={linkClass}>{"why UK passport photos get rejected"}</Link>
          {"."}
        </p>

        <h2 className={h2Class}>{"Frequently Asked Questions"}</h2>
        {FAQS.map((f) => (
          <div key={f.question}>
            <h3 className={h3Class}>{f.question}</h3>
            <p className={pClass}>{f.answer}</p>
          </div>
        ))}

        <p className={pClass}>
          {"Related: "}
          <Link href="/tool/uk-passport-photo" className={linkClass}>{"UK passport photo requirements"}</Link>{", "}
          <Link href="/tool/photo-size-35x45mm" className={linkClass}>{"35×45 mm photo"}</Link>{", "}
          <Link href="/print-passport-photos-at-home" className={linkClass}>{"print passport photos at home"}</Link>{" and "}
          <Link href="/passport-photo-print-template-generator" className={linkClass}>{"print template generator"}</Link>{"."}
        </p>
        <p className="text-xs text-base-content/60 leading-relaxed">
          {"PixPassport is an independent service and is not affiliated with HM Passport Office or GOV.UK."}
        </p>
      </div>
    </article>
  );
}

// FAQPage structured data. The same questions and answers are rendered
// visibly in <ArticleContent />, which Google requires for FAQ markup.
const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export default function PassportSizePhotoMakerPage() {
  return (
    <>
      <JsonLd
        siteUrl={SITE_URL}
        siteName="PixPassport"
        price="7.99"
        priceCurrency="GBP"
        appUrl={`${SITE_URL}/passport-size-photo-maker`}
        appId={`${SITE_URL}/#webapp`}
        description="Create official biometric passport size photos online with instant verification and printable 6x4 inch sheet."
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          {
            name: "Passport Size Photo Maker",
            url: `${SITE_URL}/passport-size-photo-maker`,
          },
        ]}
        includeOrganization={false}
        includeWebsite={false}
        includeWebApp={true}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
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
              {PAGE_H1}
            </h1>
            <p className="text-slate-700 text-xs sm:text-sm mt-1.5 max-w-md mx-auto leading-relaxed">
              Upload a phone photo and get a correctly sized passport photo in about 10 seconds: background replaced, head size checked, digital file and 6×4″ print sheet included.
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
                <p className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Need to print on 4×6″ (10×15 cm) paper?
                </p>
                <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-lg leading-relaxed">
                  Tile multiple passport photos onto standard 4×6″ or A4 sheets with cutting guides. Save money at Boots, Tesco, or{" "}
                  <Link href="/print-passport-photos-at-home" className="underline text-lime-300 hover:text-lime-200">
                    print passport photos at home
                  </Link>
                  .
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
                  className="bg-white border border-slate-200 hover:border-lime-600 p-3.5 rounded-xl flex items-center justify-between text-xs transition-all duration-200 group shadow-sm hover:shadow-md hover:-translate-y-0.5"
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

          {/* SEO guide article */}
          <ArticleContent />
        </div>
      </main>

      <Footer />
    </>
  );
}