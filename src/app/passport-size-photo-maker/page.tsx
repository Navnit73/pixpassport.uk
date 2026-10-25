import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import PhotoMakerStudio from "@/components/PhotoMakerStudio";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pixpassport.uk";

const PAGE_TITLE = "Passport Photo Maker: Create Passport-Size Photos Online";
const PAGE_DESCRIPTION =
  "Make passport and visa photos online: crop, resize and edit, plus 2x2 sizing, white backgrounds, free vs paid tools and common mistakes.";

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
      "Create passport and visa photos online for the UK (35×45mm), US, Schengen Area, and 50+ countries. Automatic cropping, AI verification, and instant download.",
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
      "Create passport and visa photos online for the UK (35×45mm), US, Schengen Area, and 50+ countries. Automatic cropping, AI verification, and instant download.",
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
  { slug: "digital-passport-photo", title: "Digital Passport Photo", spec: "Online Upload", flag: "💻" },
  { slug: "photo-size-35x45mm", title: "35×45 mm Photo Size", spec: "Standard Ratio", flag: "📐" },
  { slug: "image-to-passport-size-converter", title: "Image to Passport Converter", spec: "Auto-Crop", flag: "🔄" },
  { slug: "passport-photo-at-home", title: "Passport Photo at Home", spec: "DIY & Print", flag: "🏠" },
  { slug: "take-a-passport-photo-on-iphone", title: "iPhone Passport Photo", spec: "iOS Shoot Guide", flag: "📱" },
  { slug: "passport-photo-tool", title: "Passport Photo Tool", spec: "50+ Countries", flag: "✂️" },
  { slug: "online-id-photo-maker", title: "Online ID Photo Maker", spec: "All ID Types", flag: "🪪" },
  { slug: "order-passport-photos-online", title: "Order Passport Photos", spec: "Digital & Prints", flag: "📦" },
];

// ---- Guide article (inlined) ----
const FAQS = [
  { question: "Can a passport photo be made from an existing picture?", answer: "Often yes, if the picture is recent, sharp, evenly lit and shows a neutral expression facing the camera. The crop and background then have to meet the application's rules." },
  { question: "Is 2x2 inches the standard passport photo size?", answer: "No. It is common for US documents, but many countries use 35 × 45 mm or other sizes. The size should always be taken from the official guidance for the specific document." },
  { question: "Is it acceptable to change a photo background?", answer: "It depends on the issuing authority. Some accept a clean, natural-looking replacement, while others require an unedited photo. Where in doubt, taking the picture against a plain wall avoids the question." },
  { question: "Can a free tool produce a valid passport photo?", answer: "It can, provided the output matches the requirements. The free label says nothing about compliance, so the result should be checked against the official rules." },
  { question: "Do tools guarantee that a photo will be accepted?", answer: "No. Acceptance is decided by the authority reviewing the application. A tool can help prepare the file but cannot promise a result." },
  { question: "Can a printable sheet be made?", answer: "Some services offer a sheet with several copies on one page. That depends on the tool, so it is worth checking before relying on it." },
];

function ArticleContent() {
  return (
    <article
      className="mt-10 pt-8 border-t border-slate-200"
      aria-label="Passport photo maker guide"
    >
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-wider text-lime-700 text-center mb-4">
          The Complete Guide
        </p>
        <p className="text-slate-800 text-base sm:text-lg font-medium leading-relaxed mb-4">{"A passport photo maker turns an ordinary picture into a correctly sized, cropped photo for a passport, visa or ID card. Most people searching for a free passport photo maker are in the same position: a clear photo already sits on a phone, but the application asks for exact dimensions, a plain background and even lighting."}</p>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"An online tool can handle the sizing and cropping in a few minutes, with no desktop software and no trip to a photo booth. This guide explains how the process works, what to check before downloading, and where the limits of editing lie. Requirements differ by country, issuing authority and application type, so the official instructions for the specific document always come first."}</p>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-10 mb-3">{"What Is a Passport Photo Maker?"}</h2>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"A passport photo maker is an online or app-based tool that prepares a picture to match a document's size and layout rules. A typical passport size photo maker lets the user upload an image, place the face inside a guide, crop to the required ratio and export a digital file or a printable sheet."}</p>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"The same idea goes by many names. A passport id photo maker, a passport photo creator online and an online passport size photo creator are broadly similar tools. A free online passport photo creator is defined mainly by its price. A free id photo maker or an online id photo maker may also cover driving licences, residence permits and work badges. Searches such as passport online photo maker, online passport picture maker and free id photo maker online all point to the same need: a quick way to produce a compliant photo without a studio session."}</p>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"Features vary from service to service. Some tools only crop, others adjust the background, and some add checks or print layouts. Users should read what a particular tool actually offers rather than assume it does everything."}</p>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-10 mb-3">{"How to Make a Passport Photo Online"}</h2>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"The workflow is similar across most services. Anyone who wants to make passport picture online, or to make free passport photo online without paying, can follow these five steps."}</p>
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mt-6 mb-2">{"1. Upload a photo"}</h3>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"The best source image is sharp, evenly lit and taken straight on, with the whole head and shoulders visible. A photo taken at arm's length with the phone at eye level usually works better than a close-up selfie, which can distort the face."}</p>
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mt-6 mb-2">{"2. Crop and resize the image"}</h3>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"A passport photo cropping tool places a guide over the picture so the head sits in the correct position. The same function is sometimes called a passport cropping tool or a passport picture cropping tool. A free passport photo cropping tool is enough when the photo only needs trimming to the right ratio. Anyone comparing options will also see the phrase passport photo cropping tool free, which usually points to the same kind of basic feature."}</p>
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mt-6 mb-2">{"3. Adjust the background"}</h3>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"Many documents ask for a plain, light or white background. Some tools can replace or lighten the background automatically. Whether that edit is acceptable depends on the issuing authority, which is covered further below."}</p>
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mt-6 mb-2">{"4. Check the photo requirements"}</h3>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"Before downloading, the photo should be compared with the official checklist: dimensions, head size, expression, background colour, file type and file size. A passport photo that looks fine to the eye can still be rejected because of a technical detail."}</p>
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mt-6 mb-2">{"5. Download the finished photo"}</h3>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"Most tools export a digital file for online applications. Some also create a sheet with several copies on one page for printing, which is useful for paper applications. Whether that is offered depends on the tool."}</p>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-10 mb-3">{"How to Make a Passport-Size Photo from a Regular Picture"}</h2>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"A regular picture rarely has the right proportions. A holiday snapshot might be landscape, include other people and show the face too small to be useful. The usual route has three parts:"}</p>
        <ul className="list-disc pl-5 mb-4 space-y-1.5 text-slate-700 text-sm sm:text-base leading-relaxed"><li>{"Choose a recent, unfiltered image in which the face is clear and the expression is neutral."}</li><li>{"Use the crop guide to make my photo passport size, keeping the head centred and the shoulders in frame."}</li><li>{"Export at the resolution the application requires."}</li></ul>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"The wording people use for this task varies a lot. Some want to change picture to passport size, others look to change photo to passport size, and some prefer to edit photo to passport size. Free versions of the same searches, such as change photo to passport size free and edit photo to passport size free, simply add the price. A passport size picture editor and a passport size editor free are the tools behind these searches. A passport size photo editor online, or a passport size photo editor online free, does the same job in the browser, and people comparing services will also come across the phrase free online photo editor for passport size."}</p>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"One practical point applies to all of them. Cropping an image can only use the pixels already there. A tiny, blurry thumbnail cannot be made into a sharp passport photo by resizing it."}</p>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-10 mb-3">{"How to Use a Free Passport Photo Maker"}</h2>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"A free passport size photo maker can be perfectly adequate for a simple job. The typical steps are the same as above: upload, crop, check, download. People looking for the best free online passport photo maker should judge a tool on a few practical points rather than on its marketing:"}</p>
        <ul className="list-disc pl-5 mb-4 space-y-1.5 text-slate-700 text-sm sm:text-base leading-relaxed"><li>{"Does it show the required dimensions for the chosen country and document?"}</li><li>{"Does it let the user preview the final crop before downloading?"}</li><li>{"Is the download genuinely free, or does it add a watermark or a charge at the last step?"}</li><li>{"What does it do with uploaded images, and are they deleted afterwards?"}</li></ul>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"Searches such as free passport photo maker online, online passport picture maker free, passport size photo maker online and passport size photo maker online free reflect how many people simply want something fast in a browser. Where a free passport photo edit is limited to cropping, extra steps such as background clean-up may need a separate tool or a paid upgrade."}</p>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-10 mb-3">{"How to Edit a Passport Photo Online"}</h2>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"To edit passport photo online, most tools offer a short list of controls: crop, rotate, brightness, contrast and sometimes background options. Users who want to edit passport photo online free should expect the basics to be covered, with advanced features sometimes reserved for paid plans."}</p>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"The same service may be described in different ways. An online photo editor for passport use, an online photo editor passport page, a photo editor for passport photo tasks and a photo editor for passport free option are all variations. Those who want to edit photo for passport free, or to edit id photo online for other documents, can expect similar tools. An id photo editor online typically adds sizes for non-passport documents."}</p>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"Edits should stay modest. Brightness and contrast adjustments that fix a dim picture are generally reasonable. Smoothing skin, reshaping the face or removing features that are really present is not, and many authorities state that digitally altered photos will be refused. The goal is a true likeness presented clearly."}</p>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-10 mb-3">{"How to Change a Passport Photo Background to White"}</h2>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"Background rules are among the most common reasons for rejection. Some countries require plain white, others accept off-white, cream or light grey, and a few specify a particular colour."}</p>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"People tend to ask the question in several ways: how to change background of passport photo files, change background of passport photo online free, passport photo change background, or change background passport photo. A passport photo background change online free feature, a passport photo background editor free or a passport background editor typically separates the person from the backdrop and fills it with a solid colour. Others describe the same job as edit background for passport photo or remove background for passport photo."}</p>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"When white is required, a few steps help:"}</p>
        <ol className="list-decimal pl-5 mb-4 space-y-1.5 text-slate-700 text-sm sm:text-base leading-relaxed"><li>{"Start with a photo taken against a plain, light wall if possible, because it gives the tool clean edges to work with."}</li><li>{"Use the option to change background to white for passport photo files, then zoom in to check hair and shoulders for jagged edges or leftover colour."}</li><li>{"Look for a halo or a grey fringe around the head."}</li><li>{"Use a tool offering to change passport photo background to white online free only if the application rules allow background editing."}</li></ol>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"That last point matters. Some authorities accept a replaced background if the result looks natural. Others warn that edited backgrounds can lead to refusal. Where the rules are unclear, retaking the photo in front of a plain wall is the safer choice."}</p>
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mt-6 mb-2">{"Dealing with shadows"}</h3>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"Shadows behind the head or across the face are another frequent problem. Some tools offer to remove shadow from passport photo online free, but a software fix can look unnatural, and heavy shadows on the face itself cannot be fixed honestly. Better lighting is the real remedy: face a window in daylight, keep the subject a little way from the wall, and avoid a single harsh light from one side."}</p>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-10 mb-3">{"How to Crop a Passport Photo to 2x2 Inches"}</h2>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"A 2x2-inch (51 × 51 mm) square is the standard for US passport and visa photos, and it is used for some other documents. It is not a universal size. The UK and Schengen countries typically use 35 × 45 mm, and Canada uses 50 × 70 mm, for example."}</p>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"For a US-style photo, the steps are:"}</p>
        <ol className="list-decimal pl-5 mb-4 space-y-1.5 text-slate-700 text-sm sm:text-base leading-relaxed"><li>{"Open a 2x2 photo editor or any tool with a 2x2 preset."}</li><li>{"Position the face so the head fills the portion of the frame the official guidance describes, and keep the image square."}</li><li>{"Export, then check the file size and pixel dimensions."}</li></ol>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"Many people look for a 2x2 picture editor, a 2x2 picture editor online free, a free 2x2 photo editor, a 2x2 photo editor free or a 2x2 editor free. Others type make my photo 2x2, change photo to 2x2, edit photo to 2x2 or crop photo to 2x2 free. Some documents, including certain online forms, use a square 1x1-inch format, and a 1x1 picture editor can produce that, although the specific document's rules should be checked before choosing it."}</p>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-10 mb-3">{"Passport Photo Maker vs. Passport Photo Editor"}</h2>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"The two terms overlap, but the emphasis differs."}</p>
        <ul className="list-disc pl-5 mb-4 space-y-1.5 text-slate-700 text-sm sm:text-base leading-relaxed"><li><strong className="font-semibold text-slate-900">{"A passport photo maker"}</strong>{" is built around the finished product. It usually asks for a country and document type, applies a template and produces a ready-to-use result."}</li><li><strong className="font-semibold text-slate-900">{"A passport photo editor"}</strong>{" is built around the editing steps. It gives more manual control over cropping, brightness and background, but leaves the user to know the rules."}</li></ul>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"A passport photo editor free option can suit someone who already knows the dimensions and just needs to trim a picture. A guided maker tends to suit first-time applicants who want the dimensions handled for them. Many services combine both approaches, so the label matters less than what the tool does."}</p>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"Similar logic applies to a passport picture editor and a passport picture editor free. The name does not guarantee quality, so a quick test with one image will show whether the output is clean."}</p>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-10 mb-3">{"Passport and Visa Photo Requirements by Country"}</h2>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"Rules are set by each issuing authority, and they change. The figures below are common examples and should be confirmed against current official guidance before use."}</p>
        <div className="overflow-x-auto mb-6"><table className="w-full text-left text-xs sm:text-sm border border-slate-200 bg-white"><thead className="bg-slate-100"><tr><th scope="col" className="px-3 py-2 font-semibold text-slate-900">{"Document"}</th><th scope="col" className="px-3 py-2 font-semibold text-slate-900">{"Common size"}</th><th scope="col" className="px-3 py-2 font-semibold text-slate-900">{"Background"}</th><th scope="col" className="px-3 py-2 font-semibold text-slate-900">{"Notes"}</th></tr></thead><tbody><tr className="border-t border-slate-200"><td className="px-3 py-2 text-slate-700"><Link href="/tool/uk-passport-photo" className="font-medium text-lime-800 underline hover:text-lime-900">{"UK passport"}</Link></td><td className="px-3 py-2 text-slate-700">{"35 × 45 mm"}</td><td className="px-3 py-2 text-slate-700">{"Plain, light-coloured"}</td><td className="px-3 py-2 text-slate-700">{"Digital and printed rules differ"}</td></tr><tr className="border-t border-slate-200"><td className="px-3 py-2 text-slate-700"><Link href="/tool/us-visa-photo-tool" className="font-medium text-lime-800 underline hover:text-lime-900">{"US passport and visa"}</Link></td><td className="px-3 py-2 text-slate-700">{"2 × 2 in (51 × 51 mm)"}</td><td className="px-3 py-2 text-slate-700">{"White or off-white"}</td><td className="px-3 py-2 text-slate-700">{"Strict head-size and digital file rules"}</td></tr><tr className="border-t border-slate-200"><td className="px-3 py-2 text-slate-700"><Link href="/tool/schengen-visa-photo" className="font-medium text-lime-800 underline hover:text-lime-900">{"Schengen visa"}</Link></td><td className="px-3 py-2 text-slate-700">{"Often 35 × 45 mm"}</td><td className="px-3 py-2 text-slate-700">{"Usually light, plain"}</td><td className="px-3 py-2 text-slate-700">{"Individual consulates may add detail"}</td></tr><tr className="border-t border-slate-200"><td className="px-3 py-2 text-slate-700">{"Canada passport"}</td><td className="px-3 py-2 text-slate-700">{"50 × 70 mm"}</td><td className="px-3 py-2 text-slate-700">{"Plain, light"}</td><td className="px-3 py-2 text-slate-700">{"Specific guidance on signatories and studios"}</td></tr><tr className="border-t border-slate-200"><td className="px-3 py-2 text-slate-700"><Link href="/tool/indian-passport-photo-maker" className="font-medium text-lime-800 underline hover:text-lime-900">{"India passport"}</Link></td><td className="px-3 py-2 text-slate-700">{"Often 2 × 2 in"}</td><td className="px-3 py-2 text-slate-700">{"White"}</td><td className="px-3 py-2 text-slate-700">{"Online upload has its own pixel requirements"}</td></tr></tbody></table></div>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"Beyond size, authorities commonly specify head position and visibility of the face, background colour and uniformity, lighting and shadows, image quality, digital file type and size, and printing requirements. No editing tool can guarantee acceptance, because the final decision is always made by the authority reviewing the application."}</p>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-10 mb-3">{"How to Prepare a US Visa Photo Online"}</h2>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"US applications are known for specific rules, so they are worth walking through. According to the State Department's published guidance, a US passport or visa photo is generally 2 × 2 inches, taken in the last six months, with a white or off-white background. For online uploads, a square image between 600 × 600 and 1200 × 1200 pixels in JPEG format and under about 240 KB is typically required. Applicants should confirm these figures on the official site, since they can be updated."}</p>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"A photo cropping tool us visa applicants use should do four things: produce a square crop, allow the head to be sized and positioned correctly, export JPEG, and keep the file within the size limit. Searches like photo cropping tool for us visa, visa photo cropping tool and us visa photo cropping tool free describe exactly this. For adjustments beyond cropping, a visa photo editor online free, a visa photo editor free or an online visa photo editor free can help with brightness and file size, but should not be used to alter appearance."}</p>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"Applicants should also remember that the State Department asks for unedited, natural-looking photos. A filter, a retouched face or an aggressive background swap may be grounds for rejection, so the cleanest approach is a good original photograph."}</p>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-10 mb-3">{"Common Passport Photo Mistakes to Avoid"}</h2>
        <ul className="list-disc pl-5 mb-4 space-y-1.5 text-slate-700 text-sm sm:text-base leading-relaxed"><li><strong className="font-semibold text-slate-900">{"Wrong dimensions:"}</strong>{" using 2x2 inches for a document that wants 35 × 45 mm."}</li><li><strong className="font-semibold text-slate-900">{"Shadows and glare:"}</strong>{" from a flash, a side-light or glasses."}</li><li><strong className="font-semibold text-slate-900">{"Uneven or coloured backgrounds:"}</strong>{" creases in a sheet, patterned walls or a cluttered room."}</li><li><strong className="font-semibold text-slate-900">{"Filters and heavy retouching:"}</strong>{" these can lead to refusal and may misrepresent the subject."}</li><li><strong className="font-semibold text-slate-900">{"Tilted head or smiling:"}</strong>{" most authorities want a neutral expression facing the camera."}</li><li><strong className="font-semibold text-slate-900">{"Low resolution:"}</strong>{" pictures upscaled from small images look soft."}</li><li><strong className="font-semibold text-slate-900">{"Out-of-date photos:"}</strong>{" most authorities require a recent picture."}</li><li><strong className="font-semibold text-slate-900">{"Ignoring file rules:"}</strong>{" the wrong format or an oversized file is a common reason online uploads fail."}</li></ul>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-10 mb-3">{"Free vs. Paid Passport Photo Maker Tools"}</h2>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"Free tools are usually enough for simple cropping and resizing. Paid options may add features such as automatic background handling, compliance checks, printable layouts or support. The difference is not always about quality, so these questions help:"}</p>
        <ul className="list-disc pl-5 mb-4 space-y-1.5 text-slate-700 text-sm sm:text-base leading-relaxed"><li>{"What does the free version include, and does it add a watermark?"}</li><li>{"Is the final download free, or only the preview?"}</li><li>{"Are print sheets, background replacement or checks included?"}</li><li>{"How are uploaded photos stored, and for how long?"}</li></ul>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"No paid plan guarantees acceptance either. A paid tool can reduce errors, but the official checklist is still the benchmark."}</p>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-10 mb-3">{"Frequently Asked Questions"}</h2>
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mt-6 mb-2">{"Can a passport photo be made from an existing picture?"}</h3>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"Often yes, if the picture is recent, sharp, evenly lit and shows a neutral expression facing the camera. The crop and background then have to meet the application's rules."}</p>
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mt-6 mb-2">{"Is 2x2 inches the standard passport photo size?"}</h3>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"No. It is common for US documents, but many countries use 35 × 45 mm or other sizes. The size should always be taken from the official guidance for the specific document."}</p>
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mt-6 mb-2">{"Is it acceptable to change a photo background?"}</h3>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"It depends on the issuing authority. Some accept a clean, natural-looking replacement, while others require an unedited photo. Where in doubt, taking the picture against a plain wall avoids the question."}</p>
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mt-6 mb-2">{"Can a free tool produce a valid passport photo?"}</h3>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"It can, provided the output matches the requirements. The free label says nothing about compliance, so the result should be checked against the official rules."}</p>
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mt-6 mb-2">{"Do tools guarantee that a photo will be accepted?"}</h3>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"No. Acceptance is decided by the authority reviewing the application. A tool can help prepare the file but cannot promise a result."}</p>
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mt-6 mb-2">{"Can a printable sheet be made?"}</h3>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"Some services offer a sheet with several copies on one page. That depends on the tool, so it is worth checking before relying on it."}</p>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-10 mb-3">{"Conclusion"}</h2>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">{"A passport photo maker takes much of the hassle out of preparing an official photo, but it works best alongside good habits: a sharp original, plain lighting, honest editing and a final check against the current rules. The next step is simple. Look up the exact requirements for the document, take or choose a suitable picture, and run it through a tool that shows the correct dimensions before downloading."}</p>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">
          {"Related tools: "}
          <Link href="/tool/image-to-passport-size-converter" className="text-lime-800 underline hover:text-lime-900">{"image to passport size converter"}</Link>{", "}
          <Link href="/tool/photo-size-35x45mm" className="text-lime-800 underline hover:text-lime-900">{"35×45 mm photo size"}</Link>{", "}
          <Link href="/tool/digital-passport-photo" className="text-lime-800 underline hover:text-lime-900">{"digital passport photo"}</Link>{", "}
          <Link href="/passport-photo-print-template-generator" className="text-lime-800 underline hover:text-lime-900">{"print template generator"}</Link>{" and "}
          <Link href="/tool/passport-photo-at-home" className="text-lime-800 underline hover:text-lime-900">{"passport photo at home"}</Link>{"."}
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
              {PAGE_TITLE}
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