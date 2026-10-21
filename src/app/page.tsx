import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Upload,
  CheckCircle,
  Shield,
  Printer,
  Zap,
  Lock,
  Globe,
  ArrowRight,
  Crop,
  RefreshCw,
  BookOpenCheck,
  Users,
  ChevronRight,
  AlertCircle,
  ExternalLink,
  Baby,
  FileText,
  Check,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import PhotoMakerStudio from "@/components/PhotoMakerStudio";
import GovUkPhotoNotice from "@/components/GovUkPhotoNotice";

export const metadata: Metadata = {
  title: {
    absolute: "UK Passport Photo Online — Digital & Printed | PixPassport",
  },
  description:
    "Make a UK passport photo online for GOV.UK applications and renewals. Upload a phone photo, check it against HMPO guidance and download for £7.99.",
  alternates: {
    canonical: "/",
    languages: {
      "en-GB": "/",
    },
  },
  openGraph: {
    title: "UK Passport Photo Online — PixPassport",
    description:
      "Turn a phone photo into a UK passport photo. Checked against HMPO guidance, ready for GOV.UK or printing.",
    url: "/",
  },
};

const steps = [
  {
    icon: Globe,
    step: 1,
    title: "Select Your Country",
    description:
      "Pick the UK, US, Australia, Canada, Schengen Area, India, or one of 50+ countries. We load the official biometric size for that passport, visa, or ID photo automatically.",
  },
  {
    icon: Crop,
    step: 2,
    title: "Upload and Auto-Crop",
    description:
      "Upload any digital photo for your passport application. Our passport picture cropping tool centres your face, straightens your head position, and resizes the image to the exact pixel dimensions required.",
  },
  {
    icon: Zap,
    step: 3,
    title: "Preview and Download",
    description:
      "In under 10 seconds you get a compliant digital photo plus a print-ready 6×4″ sheet, ready to upload or take to a photo shop for professional printing.",
  },
];

const features = [
  {
    icon: Globe,
    title: "50+ Global Passport Formats",
    description:
      "Create a passport picture online for the UK (600×750), US (600×600), Australia (413×531), Schengen Area (630×810), and dozens more official formats.",
  },
  {
    icon: Crop,
    title: "Passport Picture Cropping Tool",
    description:
      "Our built-in cropping tool detects your face and eye line, then aligns and trims your photo to match strict head-size and centring rules automatically.",
  },
  {
    icon: Shield,
    title: "Biometric AI Verification",
    description:
      "Every upload is checked for head height, eye position, background colour, and lighting, so you can fix problems before you submit your application.",
  },
  {
    icon: RefreshCw,
    title: "Built for Passport Renewal",
    description:
      "Renewing a passport or visa? Generate a fresh digital photo for passport renewal that meets the same rules as a first-time application, without a studio visit.",
  },
  {
    icon: Printer,
    title: "Print Passport Photo Online",
    description:
      "Download a high-resolution file, then take the ready-made 6×4″ sheet to a pharmacy or photo shop. UK passport photos must be printed to a professional standard on plain white photographic paper.",
  },
  {
    icon: Lock,
    title: "Instant Download & Complete Privacy",
    description:
      "No subscriptions, instant high-resolution download, and no watermark. Create compliant photos for the whole family safely and securely.",
  },
];

const pricingBenefits = [
  "Official biometric dimensions for 50+ countries",
  "Automatic passport picture cropping and resizing",
  "Smart in-browser compression to ≤ 3 MB",
  "High-resolution single digital passport photo",
  "Standard 6×4″ (10×15 cm) multi-photo print sheet",
  "Instant download with no registration or subscriptions needed",
];

const trustPoints = [
  {
    icon: Users,
    title: "Built From Real Applications",
    description:
      "We tested PixPassport against thousands of real UK passport, US visa, and Schengen applications to fine-tune head size, spacing, and background checks that actually get accepted.",
  },
  {
    icon: BookOpenCheck,
    title: "Rules Sourced From Official Guidance",
    description:
      "Every country profile is built directly from government passport office and visa authority specifications, and we review these standards each time an issuing authority updates its rules.",
  },
  {
    icon: Shield,
    title: "Automated Compliance Checks",
    description:
      "Each photo runs through automated biometric checks before download, so you can see exactly why a photo passes or fails instead of guessing.",
  },
  {
    icon: Lock,
    title: "Your Photo Stays Private",
    description:
      "Photos are processed for your session only and are never sold, shared, or used to train other tools. You control the download, start to finish.",
  },
];

const faqs = [
  {
    question: "How do I make a UK passport photo online?",
    answer:
      "Ask someone to take a photo of you facing a window, in front of a plain light-coloured wall. Upload it, and the tool sizes it and checks it against HM Passport Office guidance in about 10 seconds. You get a digital photo plus a 6×4″ print sheet for paper forms.",
  },
  {
    question: "Can I take my UK passport photo on my phone?",
    answer:
      "Yes. GOV.UK lets you take a digital photo on your own device, but you need someone to help you take it. Include your head, shoulders and upper body, because GOV.UK crops the photo for you. GOV.UK also notes that photos from a booth or shop are more likely to be approved.",
  },
  {
    question: "What are the official UK passport photo size requirements?",
    answer:
      "A UK digital passport photo must be at least 600 pixels wide and 750 pixels tall, with a file size between 50KB and 10MB. Printed photos must be 45 mm high by 35 mm wide, with the face measuring 29 mm to 34 mm from chin to crown.",
  },
  {
    question: "Can I use this for a passport renewal photo?",
    answer:
      "Yes. HM Passport Office requires a new photo, taken in the last month, for every renewal, even if your appearance has not changed. Our tool creates a fresh digital photo for passport renewal that meets the same rules as a first-time application.",
  },
  {
    question: "How does the passport picture cropping tool work?",
    answer:
      "The cropping tool detects your face, eyes, and shoulders, then aligns your head to the correct height and position before trimming the image to your chosen country's exact dimensions, so nothing is cropped by hand.",
  },
  {
    question: "How do I get my passport photo printed?",
    answer:
      "Download the print-ready 6×4″ sheet and take it to a pharmacy or photo shop, or upload it to an online print service. For a UK paper passport form, GOV.UK says photos must be printed to a professional standard, in colour, on plain white photographic paper with no border.",
  },
  {
    question: "Do you make visa photos for other countries?",
    answer:
      "Yes. As well as UK passport photos, PixPassport supports 53 countries, including the US, Canada, Australia, India and the Schengen Area, for passport, visa and ID photos.",
  },
  {
    question: "What file formats can I upload?",
    answer:
      "JPEG, PNG, and WebP files up to 20 MB are accepted, including high-resolution photos straight from a modern smartphone camera.",
  },
  {
    question: "How long does processing take?",
    answer:
      "Around 10 seconds. The tool checks eye level, face centring, and background uniformity before producing your high-resolution digital photo and printable sheet.",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd
        price="7.99"
        priceCurrency="GBP"
        faqItems={faqs}
        pageUrl="https://pixpassport.uk/"
        pageName="UK Passport Photo Online — Digital & Printed"
        pageDescription="Make a UK passport photo online for GOV.UK applications and renewals. Upload a phone photo, check it against HMPO guidance and download for £7.99."
      />

      <Navbar ctaText="Upload Photo" ctaHref="#studio" />

      <main className="flex-1 bg-white text-slate-900" id="main-content">
        {/* =========================================================================
            1. HERO SECTION (Clean, responsive, standardized)
           ========================================================================= */}
        <section className="bg-white py-10 sm:py-16 lg:py-20 border-b border-slate-200/80" id="hero" aria-label="Introduction and photo maker overview">
          <div className="container-narrow">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left copy column */}
              <div className="lg:col-span-7 max-w-2xl">
                {/* Official Biometric Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime-50 border border-lime-300 text-xs font-bold text-[#365314] tracking-wide mb-5">
                  <span className="w-2 h-2 rounded-full bg-[#4D7C0F]" aria-hidden="true" />
                  <span>UK PASSPORT PHOTO · BASED ON GOV.UK GUIDANCE</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0F172A] tracking-tight leading-[1.18] mb-3">
                  UK Passport Photo Online
                </h1>

                {/* Sub-heading */}
                <p className="text-lg sm:text-xl text-[#334155] font-semibold mb-4 leading-snug">
                  Digital and printed passport photos for new applications and renewals
                </p>

                {/* Body description */}
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-7 max-w-xl">
                  Take a photo on your phone, upload it, and get a UK passport
                  photo sized and checked against HM Passport Office guidance in
                  under 10 seconds. Use it for a GOV.UK online application, or
                  print it for a paper form. Visa photos for the US, Schengen
                  Area and 50+ other countries are also supported.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5 mb-7">
                  <a
                    href="#studio"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#4D7C0F] hover:bg-[#3F650C] active:bg-[#365314] !text-white text-white font-bold text-base px-7 py-3.5 sm:py-4 rounded-xl transition-colors text-center shadow-xs focus-ring"
                  >
                    <span>Create My UK Passport Photo</span>
                    <ArrowRight className="w-4 h-4 ml-0.5" aria-hidden="true" />
                  </a>
                  <a
                    href="#how-it-works"
                    className="w-full sm:w-auto inline-flex items-center justify-center bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base px-6 py-3.5 sm:py-4 rounded-xl border border-slate-300 transition-colors text-center focus-ring"
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

              {/* Visual preview column */}
              <div className="lg:col-span-5 flex justify-center w-full">
                <div className="w-full max-w-sm lg:max-w-md">
                  <div className="relative overflow-hidden aspect-[4/5]">
                    <Image
                      src="/images/digital-passport-photo_example.webp"
                      alt="Example UK passport photo, 35×45 mm, plain light grey background"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                      className="object-cover rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            1b. PHOTO MAKER STUDIO (UK passport by default)
           ========================================================================= */}
        <section className="bg-slate-50 py-10 sm:py-16 border-b border-slate-200/80" id="studio" aria-labelledby="studio-heading">
          <div className="container-narrow max-w-2xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-5 sm:mb-7">
              <h2 id="studio-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Create Your UK Passport Photo
              </h2>
              <p className="text-slate-700 text-xs sm:text-sm mt-1.5 max-w-md mx-auto leading-relaxed">
                Upload a recent photo and we will size it and check it against HM Passport Office guidance.
                Applying for a visa or another country? Change the country below.
              </p>
            </div>
            <PhotoMakerStudio defaultCountryCode="GB" defaultDocumentType="passport" />
            <GovUkPhotoNotice className="mt-5" />
          </div>
        </section>

        {/* =========================================================================
            2. HOW IT WORKS SECTION (Clean connected layout, no heavy boxy cards)
           ========================================================================= */}
        <section className="bg-slate-50/70 py-14 sm:py-20 border-b border-slate-200/80" id="how-it-works">
          <div className="container-narrow">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <span className="inline-block px-3 py-1 rounded-full bg-lime-100 border border-lime-300 text-[#4D7C0F] text-xs font-bold mb-3">
                Simple 3-Step Process
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-3">
                How to Make a UK Passport Photo Online
              </h2>
              <p className="text-slate-700 text-sm sm:text-base">
                Three steps take you from a regular phone photo to a correctly
                sized, checked passport photo for the UK and 50+ countries.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {steps.map(({ icon: Icon, step, title, description }) => (
                <div
                  key={step}
                  className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-lime-600 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between w-full mb-6">
                      <div className="w-12 h-12 rounded-xl bg-lime-50 border border-lime-200 flex items-center justify-center text-[#4D7C0F]" aria-hidden="true">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                        Step 0{step}
                      </span>
                    </div>

                    <h3 className="text-slate-900 text-lg sm:text-xl font-bold mb-2">
                      {title}
                    </h3>

                    <p className="text-slate-700 text-sm leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10 sm:mt-12">
              <a
                href="#studio"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#4D7C0F] hover:bg-[#3F650C] !text-white text-white font-bold text-base px-8 py-3.5 sm:py-4 rounded-xl transition-colors text-center shadow-xs"
              >
                <Upload className="w-5 h-5" aria-hidden="true" />
                <span>Upload &amp; Create Photo Now</span>
                <ArrowRight className="w-4 h-4 ml-0.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. FEATURES SECTION (Unified border-divided layout, no individual heavy card clutter)
           ========================================================================= */}
        <section className="bg-white py-14 sm:py-20 border-b border-slate-200/80" id="features" aria-label="Core features and capabilities">
          <div className="container-narrow">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <span className="inline-block px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold mb-3">
                Engineered for Acceptance
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-3">
                Everything You Need From a UK Passport Photo Maker
              </h2>
              <p className="text-slate-700 text-sm sm:text-base">
                Create, crop, verify, and print official biometric passport
                photos from any device, for a first application or a renewal.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {features.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-start hover:border-lime-600 transition-colors"
                >
                  <div className="w-11 h-11 rounded-xl bg-lime-50 border border-lime-200 text-[#4D7C0F] flex items-center justify-center shrink-0 mb-4" aria-hidden="true">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="font-bold text-[#0F172A] text-base sm:text-lg mb-2">
                    {title}
                  </h3>

                  <p className="text-slate-700 text-sm leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. TRUST / E-E-A-T SECTION (Clean 2x2 grid, no shadows)
           ========================================================================= */}
        <section className="bg-slate-50/70 py-14 sm:py-20 border-b border-slate-200/80" id="trust" aria-label="Trust and compliance verification">
          <div className="container-narrow">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <span className="inline-block px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold mb-3">
                Why Trust PixPassport
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-3">
                Photo Rules You Can Verify, Not Just Trust
              </h2>
              <p className="text-slate-700 text-sm sm:text-base">
                We built PixPassport with applicants and immigration document
                specialists, and we keep every country profile current.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {trustPoints.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-lime-50 border border-lime-200 text-[#4D7C0F] flex items-center justify-center shrink-0" aria-hidden="true">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-[#0F172A] text-base sm:text-lg">
                        {title}
                      </h3>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. OFFICIAL UK DIGITAL PASSPORT PHOTO RULES & GUIDANCE
           ========================================================================= */}
        <section className="bg-white py-14 sm:py-20 border-b border-slate-200/80" id="photo-rules" aria-label="Official UK photo rules and guidelines">
          <div className="container-narrow">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <span className="inline-block px-3 py-1 rounded-full bg-lime-100 border border-lime-300 text-[#365314] text-xs font-bold mb-3">
                Official UK Guidance
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-3">
                Rules &amp; Guidance for Digital Passport Photos
              </h2>
              <p className="text-slate-700 text-sm sm:text-base">
                Official government standards for online passport applications, device photography, and child photos.
              </p>
            </div>

            <div className="space-y-6 max-w-4xl mx-auto">
              {/* 1. Digital Photos Overview */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-3 flex items-center gap-2.5">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-[#4D7C0F]" aria-hidden="true" />
                  Digital photos
                </h3>
                <p className="text-slate-800 text-sm sm:text-base font-medium mb-4">
                  You need a digital photo to apply for a passport online.
                </p>
                <ul className="space-y-2.5 text-slate-700 text-sm sm:text-base mb-5">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#4D7C0F] shrink-0 mt-1" aria-hidden="true" />
                    <span>You must get a new photo when you get a new passport, even if your appearance has not changed.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#4D7C0F] shrink-0 mt-1" aria-hidden="true" />
                    <span>Your photo must have been taken in the last month.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-1" aria-hidden="true" />
                    <span className="text-amber-950 font-semibold">Your application will be delayed if your photos do not meet the rules.</span>
                  </li>
                </ul>
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-slate-800">
                  <span>You can get</span>
                  <a
                    href="https://www.gov.uk/passport-services-disabled"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-[#365314] hover:underline"
                  >
                    <span>help with your passport photos</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    <span className="sr-only">(opens in new window)</span>
                  </a>
                  <span>if you’re disabled.</span>
                </div>
              </div>

              {/* 3. Rules for digital photos */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-5 flex items-center gap-2.5">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-[#4D7C0F]" aria-hidden="true" />
                  Rules for digital photos
                </h3>

                <div className="space-y-6">
                  {/* The quality of your digital photo */}
                  <div>
                    <h4 className="font-bold text-[#0F172A] text-base sm:text-lg mb-2">
                      The quality of your digital photo
                    </h4>
                    <p className="text-slate-700 text-sm mb-3">Your photo must be:</p>
                    <ul className="grid sm:grid-cols-2 gap-2 text-sm text-slate-800">
                      <li className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-lg">
                        <Check className="w-4 h-4 text-[#4D7C0F] shrink-0" aria-hidden="true" />
                        <span>clear and in focus</span>
                      </li>
                      <li className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-lg">
                        <Check className="w-4 h-4 text-[#4D7C0F] shrink-0" aria-hidden="true" />
                        <span>in colour</span>
                      </li>
                      <li className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-lg">
                        <Check className="w-4 h-4 text-[#4D7C0F] shrink-0" aria-hidden="true" />
                        <span>unaltered by computer software</span>
                      </li>
                      <li className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-lg">
                        <Check className="w-4 h-4 text-[#4D7C0F] shrink-0" aria-hidden="true" />
                        <span>at least 600 pixels wide and 750 pixels tall</span>
                      </li>
                      <li className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-lg sm:col-span-2">
                        <Check className="w-4 h-4 text-[#4D7C0F] shrink-0" aria-hidden="true" />
                        <span>at least 50KB and no more than 10MB</span>
                      </li>
                    </ul>
                  </div>

                  {/* What your digital photo must show */}
                  <div className="border-t border-slate-100 pt-6">
                    <h4 className="font-bold text-[#0F172A] text-base sm:text-lg mb-2">
                      What your digital photo must show
                    </h4>
                    <p className="text-slate-700 text-sm mb-3">The digital photo must:</p>
                    <ul className="space-y-2 text-sm text-slate-800 mb-4">
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#4D7C0F] shrink-0 mt-0.5" aria-hidden="true" />
                        <span>contain no other objects or people</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#4D7C0F] shrink-0 mt-0.5" aria-hidden="true" />
                        <span>be taken against a plain light-coloured background</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#4D7C0F] shrink-0 mt-0.5" aria-hidden="true" />
                        <span>be in clear contrast to the background</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#4D7C0F] shrink-0 mt-0.5" aria-hidden="true" />
                        <span>not have ‘red eye’</span>
                      </li>
                    </ul>

                    <p className="text-sm bg-lime-50/80 border border-lime-200 text-[#365314] font-medium rounded-xl p-3.5 mb-5">
                      If you’re using a photo taken on your own device, include your head, shoulders and upper body. Do not crop your photo - it will be done for you. Test your picture with our{" "}
                      <Link
                        href="/tool/passport-photo-checker-uk"
                        className="font-bold underline text-[#365314] hover:text-[#4D7C0F] transition-colors"
                      >
                        UK passport photo checker
                      </Link>
                      , read the full{" "}
                      <Link
                        href="/tool/uk-passport-photo"
                        className="font-bold underline text-[#365314] hover:text-[#4D7C0F] transition-colors"
                      >
                        UK passport photo requirements
                      </Link>
                      , or learn{" "}
                      <Link
                        href="/tool/take-a-passport-photo-on-iphone"
                        className="font-bold underline text-[#365314] hover:text-[#4D7C0F] transition-colors"
                      >
                        how to take a passport photo on iPhone
                      </Link>
                      .
                    </p>

                    <p className="text-slate-800 text-sm mb-3 font-semibold">In your photo you must:</p>
                    <ul className="grid sm:grid-cols-2 gap-2 text-sm text-slate-800 mb-4">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#4D7C0F] shrink-0 mt-0.5" aria-hidden="true" />
                        <span>be facing forwards and looking straight at the camera</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#4D7C0F] shrink-0 mt-0.5" aria-hidden="true" />
                        <span>have a plain expression and your mouth closed</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#4D7C0F] shrink-0 mt-0.5" aria-hidden="true" />
                        <span>have your eyes open and visible</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#4D7C0F] shrink-0 mt-0.5" aria-hidden="true" />
                        <span>not have hair in front of your eyes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#4D7C0F] shrink-0 mt-0.5" aria-hidden="true" />
                        <span>not have a head covering (unless it’s for religious or medical reasons)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#4D7C0F] shrink-0 mt-0.5" aria-hidden="true" />
                        <span>not have anything covering your face</span>
                      </li>
                      <li className="flex items-start gap-2 sm:col-span-2">
                        <Check className="w-4 h-4 text-[#4D7C0F] shrink-0 mt-0.5" aria-hidden="true" />
                        <span>not have any shadows on your face or behind you</span>
                      </li>
                    </ul>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm text-slate-800">
                      <strong>Glasses:</strong> Do not wear glasses in your photo unless you have to do so. If you must wear glasses, they cannot be sunglasses or tinted glasses, and you must make sure your eyes are not covered by the frames or any glare, reflection or shadow.
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Photos of babies and children */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-4 flex items-center gap-2.5">
                  <Baby className="w-5 h-5 sm:w-6 sm:h-6 text-[#4D7C0F]" aria-hidden="true" />
                  Photos of babies and children
                </h3>
                <ul className="space-y-3 text-sm sm:text-base text-slate-800">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#4D7C0F] shrink-0 mt-1" aria-hidden="true" />
                    <span>Children must be on their own in the picture. Babies must not be holding toys or using dummies.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#4D7C0F] shrink-0 mt-1" aria-hidden="true" />
                    <span>Children under 6 do not have to be looking directly at the camera or have a plain expression.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#4D7C0F] shrink-0 mt-1" aria-hidden="true" />
                    <span>Children under one do not have to have their eyes open. You can support their head with your hand, but your hand must not be visible in the photo.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#4D7C0F] shrink-0 mt-1" aria-hidden="true" />
                    <span>Children under one should lie on a plain light-coloured sheet. Take the photo from above.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            6. PRICING SECTION (£7.99 Flat Fee, No Shadows)
           ========================================================================= */}
        <section className="bg-white py-14 sm:py-20 border-b border-slate-200/80" id="pricing" aria-label="Transparent pricing details">
          <div className="container-narrow">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-block px-3 py-1 rounded-full bg-lime-100 border border-lime-300 text-[#365314] text-xs font-bold mb-3">
                Transparent Pricing
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-3">
                Passport Photo Maker Package
              </h2>
              <p className="text-slate-700 text-sm sm:text-base">
                One-off payment for your complete compliant digital photo and printable sheet.
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="bg-white border-2 border-[#4D7C0F] rounded-2xl overflow-hidden p-6 sm:p-8">
                <div className="text-center pb-6 border-b border-slate-200">
                  <div className="inline-block px-3 py-1 rounded-md bg-lime-100 text-[#365314] mb-3 font-bold text-xs uppercase tracking-wide">
                    Complete Photo Package
                  </div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-extrabold text-[#0F172A] tracking-tight">
                      £7.99
                    </span>
                    <span className="text-slate-700 text-base font-medium">
                      /photo
                    </span>
                  </div>
                  <p className="text-slate-700 text-xs sm:text-sm mt-2">
                    Includes ready-to-submit digital photo and 6×4″ printable sheet
                  </p>
                </div>

                <ul className="py-6 space-y-3 list-none p-0 m-0">
                  {pricingBenefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-2.5 text-slate-800 text-sm"
                    >
                      <CheckCircle className="w-4 h-4 text-[#4D7C0F] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#studio"
                  className="inline-flex items-center justify-center w-full text-center bg-[#4D7C0F] hover:bg-[#3F650C] !text-white text-white font-bold text-base py-3.5 sm:py-4 rounded-xl transition-colors shadow-xs"
                >
                  Create Your Passport Photo Now
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            7. POPULAR COUNTRY & DOCUMENT FORMATS (Internal Linking SEO Grid)
           ========================================================================= */}
        <section className="bg-white py-14 sm:py-20 border-b border-slate-200/80" id="popular-tools" aria-label="Popular country and document photo formats">
          <div className="container-narrow">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-block px-3 py-1 rounded-full bg-lime-100 border border-lime-300 text-[#365314] text-xs font-bold mb-3">
                Global Standards
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-3">
                Popular Passport &amp; Visa Photo Formats
              </h2>
              <p className="text-slate-700 text-sm sm:text-base">
                Explore dedicated specifications and automated photo makers for top destinations.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {[
                {
                  slug: "uk-passport-photo",
                  title: "UK Passport Photo",
                  spec: "35×45 mm (600×750 px)",
                  flag: "🇬🇧",
                  desc: "Official HMPO biometric specification for British passport renewal and first applications.",
                },
                {
                  slug: "us-visa-photo-tool",
                  title: "US Visa & Passport",
                  spec: "2×2 inches (51×51 mm)",
                  flag: "🇺🇸",
                  desc: "Department of State compliant square photo for DS-160 visa applications and US passports.",
                },
                {
                  slug: "schengen-visa-photo",
                  title: "Schengen Visa Photo",
                  spec: "35×45 mm (630×810 px)",
                  flag: "🇪🇺",
                  desc: "Biometric standard for France, Germany, Italy, Spain, and all 29 European member states.",
                },
                {
                  slug: "uk-baby-passport-photo",
                  title: "Baby Passport Photo",
                  spec: "UK HMPO Infant Size",
                  flag: "👶",
                  desc: "Specialized infant & toddler guidance with relaxed head positioning and automatic background cleanup.",
                },
                {
                  slug: "indian-passport-photo-maker",
                  title: "Indian Passport & OCI",
                  spec: "35×45 mm (630×810 px)",
                  flag: "🇮🇳",
                  desc: "VFS Global & High Commission compliant dimensions for Indian passport renewal and OCI cards.",
                },
                {
                  slug: "uk-driving-licence-photo",
                  title: "UK Driving Licence",
                  spec: "DVLA 35×45 mm",
                  flag: "🚗",
                  desc: "Driver and Vehicle Licensing Agency compliant photo for provisional and photocard renewal.",
                },
              ].map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tool/${tool.slug}`}
                  className="bg-slate-50 hover:bg-white border border-slate-200 hover:border-lime-600 rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all group shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl" role="img" aria-hidden="true">{tool.flag}</span>
                      <span className="font-mono text-xs font-semibold bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded">
                        {tool.spec}
                      </span>
                    </div>
                    <h3 className="font-bold text-[#0F172A] text-base sm:text-lg mb-1.5 group-hover:text-[#365314] transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
                      {tool.desc}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4D7C0F] group-hover:text-[#365314]">
                    <span>View Specifications &amp; Create</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>

            {/* Quick Link Pills to Specialized Converters & Photo Tools */}
            <div className="mt-8 pt-6 border-t border-slate-200/80 max-w-5xl mx-auto">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 mr-1">
                  More Tools:
                </span>
                <Link
                  href="/passport-photo-print-template-generator"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-100 hover:bg-lime-200 border border-lime-300 text-xs font-bold text-lime-950 transition-colors shadow-2xs"
                >
                  <span className="text-lime-700">🖨️</span>
                  <span>Print Template Generator (4×6″)</span>
                  <ArrowRight className="w-3 h-3 text-lime-800" />
                </Link>
                <Link
                  href="/print-passport-photos-at-home"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-100 hover:bg-lime-200 border border-lime-300 text-xs font-bold text-lime-950 transition-colors shadow-2xs"
                >
                  <span className="text-lime-700">🏠</span>
                  <span>Print Passport Photos at Home</span>
                  <ArrowRight className="w-3 h-3 text-lime-800" />
                </Link>
                {[
                  { slug: "british-passport-picture-maker", label: "British Passport Picture" },
                  { slug: "passport-photo-checker-uk", label: "UK Photo Checker" },
                  { slug: "uk-visa-photo", label: "UK Visa Photo" },
                  { slug: "passport-renewal-photo-online", label: "UK Passport Renewal" },
                  { slug: "take-a-passport-photo-on-iphone", label: "iPhone Passport Photo" },
                  { slug: "digital-passport-photo", label: "Digital Photo for Passport" },
                  { slug: "photo-size-35x45mm", label: "35×45 mm Photo Size" },
                  { slug: "image-to-passport-size-converter", label: "Image to Passport Converter" },
                  { slug: "passport-photo-at-home", label: "Passport Photo at Home" },
                  { slug: "passport-photo-tool", label: "Online Passport Photo Tool" },
                  { slug: "online-id-photo-maker", label: "Online ID Photo Maker" },
                  { slug: "order-passport-photos-online", label: "Order Passport Photos" },
                ].map((item) => (
                  <Link
                    key={item.slug}
                    href={`/tool/${item.slug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-lime-50 border border-slate-200 hover:border-lime-300 text-xs font-semibold text-slate-800 hover:text-lime-900 transition-colors"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            8. FAQ SECTION (Clean accordion, no shadows)
           ========================================================================= */}
        <section className="bg-slate-50/70 py-14 sm:py-20 border-b border-slate-200/80" id="faq" aria-label="Frequently Asked Questions">
          <div className="container-narrow">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <span className="inline-block px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold mb-3">
                Got Questions?
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-700 text-sm sm:text-base">
                Common questions about country rules, renewals, cropping, and printing.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-3">
              {faqs.map(({ question, answer }, index) => (
                <div
                  key={index}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden"
                >
                  <details className="group [&_summary::-webkit-details-marker]:hidden" open={index === 0}>
                    <summary className="flex items-center justify-between p-5 cursor-pointer select-none font-semibold text-slate-900 text-base sm:text-lg hover:text-[#365314] focus-ring transition-colors rounded-xl">
                      <span>{question}</span>
                      <span className="ml-4 shrink-0 text-slate-700 group-open:rotate-90 transition-transform" aria-hidden="true">
                        <ChevronRight className="w-5 h-5" />
                      </span>
                    </summary>
                    <div className="px-5 pb-5 text-slate-700 text-sm sm:text-base leading-relaxed border-t border-slate-100 pt-3">
                      {answer}
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}