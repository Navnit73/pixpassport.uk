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
      "In under 10 seconds you get a compliant digital photo plus a print-ready 6×4″ sheet, ready to submit online or print at home.",
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
      "Every upload is checked for head height, eye position, background colour, and lighting, so your digital photo for passport applications is accepted the first time.",
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
      "Download a high-resolution file and print your passport photo online at home, or take the ready-made 6×4″ sheet to any pharmacy or photo kiosk.",
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
    title: "Independently Verified Compliance",
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
    question: "How do I create a passport picture online?",
    answer:
      "Choose your country, upload a clear photo of your face against a plain background, and let the tool crop and resize it automatically. You will get a compliant digital photo for passport use in under a minute, with no software to install.",
  },
  {
    question: "What are the official UK passport photo size requirements?",
    answer:
      "A UK digital passport photo must be 600×750 pixels, or 35 mm wide by 45 mm high when printed. Head height from chin to crown must measure 29 mm to 34 mm, which is 70–80% of the image height.",
  },
  {
    question: "Can I use this for a passport renewal photo?",
    answer:
      "Yes. Passport offices require a brand-new photo for every renewal, even if your appearance has not changed much. Our tool creates a fresh digital photo for passport renewal that meets the same rules as a first-time application.",
  },
  {
    question: "How does the passport picture cropping tool work?",
    answer:
      "The cropping tool detects your face, eyes, and shoulders, then aligns your head to the correct height and position before trimming the image to your chosen country's exact dimensions, so nothing is cropped by hand.",
  },
  {
    question: "Can I print my passport photo online, or only at home?",
    answer:
      "Both. Download the print-ready 6×4″ sheet and take it to a pharmacy or photo kiosk, or print passport photos online through a print-mailing service using the same high-resolution file.",
  },
  {
    question: "Which countries and documents are supported?",
    answer:
      "PixPassport supports 53 countries, including the UK, US, Canada, Australia, India, the Schengen Area, Japan, China, Singapore, and New Zealand, for passports, visas, and national ID photos.",
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
      />

      <Navbar ctaText="Upload Photo" ctaHref="/passport-size-photo-maker" />

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
                  <span>UK PASSPORT PHOTO TOOL · ICAO COMPLIANT</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0F172A] tracking-tight leading-[1.18] mb-3">
                  Create a Passport Picture Online
                </h1>

                {/* Sub-heading */}
                <p className="text-lg sm:text-xl text-[#334155] font-semibold mb-4 leading-snug">
                  The UK passport photo maker for new applications and renewals
                </p>

                {/* Body description */}
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-7 max-w-xl">
                  Upload one photo and get a ready-to-submit digital photo for your
                  passport, visa, or passport renewal. We crop, resize, and check
                  your photo against official government rules for the UK, US,
                  Schengen Area, and 50+ other countries in under 10 seconds.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5 mb-7">
                  <Link
                    href="/passport-size-photo-maker"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#4D7C0F] hover:bg-[#3F650C] active:bg-[#365314] !text-white text-white font-bold text-base px-7 py-3.5 sm:py-4 rounded-xl transition-colors text-center shadow-xs focus-ring"
                  >
                    <span>Create My Passport Photo</span>
                    <ArrowRight className="w-4 h-4 ml-0.5" aria-hidden="true" />
                  </Link>
                  <a
                    href="#how-it-works"
                    className="w-full sm:w-auto inline-flex items-center justify-center bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base px-6 py-3.5 sm:py-4 rounded-xl border border-slate-300 transition-colors text-center focus-ring"
                  >
                    How It Works
                  </a>
                </div>

                {/* Rating & Social Proof */}
                <div className="flex items-center gap-2.5 mb-6 text-sm" aria-label="Rated 4.9 out of 5 stars based on 17,000+ reviews">
                  <div className="flex items-center text-amber-500 gap-0.5" aria-hidden="true">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 fill-current"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-slate-900 text-sm font-bold">
                    4.9 · <span className="font-medium text-slate-700">Trusted by 17,000+ users</span>
                  </span>
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
                  <div className="p-3 sm:p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
                    <div className="relative rounded-xl overflow-hidden aspect-[4/5] bg-white shadow-xs">
                      <Image
                        src="https://res.cloudinary.com/dipzpwbbk/image/upload/v1790507890/uk_passport_size_photo_i5uujz.jpg"
                        alt="Official UK Passport Size Photo Sample"
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                        className="object-cover rounded-xl"
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-600 px-1 font-medium">
                      <span>Official 35×45 mm (600×750 px)</span>
                      <span className="font-mono text-emerald-800 font-bold">100% Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                How to Create a Digital Photo for Passport Online
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Three steps take you from a regular photo to an accepted
                biometric passport picture for the UK and 50+ countries.
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
              <Link
                href="/passport-size-photo-maker"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#4D7C0F] hover:bg-[#3F650C] !text-white text-white font-bold text-base px-8 py-3.5 sm:py-4 rounded-xl transition-colors text-center shadow-xs"
              >
                <Upload className="w-5 h-5" aria-hidden="true" />
                <span>Upload &amp; Create Photo Now</span>
                <ArrowRight className="w-4 h-4 ml-0.5" aria-hidden="true" />
              </Link>
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
                      If you’re using a photo taken on your own device, include your head, shoulders and upper body. Do not crop your photo - it will be done for you.
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
                    <span className="text-slate-600 text-base font-medium">
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

                <Link
                  href="/passport-size-photo-maker"
                  className="inline-flex items-center justify-center w-full text-center bg-[#4D7C0F] hover:bg-[#3F650C] !text-white text-white font-bold text-base py-3.5 sm:py-4 rounded-xl transition-colors shadow-xs"
                >
                  Create Your Passport Photo Now
                </Link>
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
                  spec: "51×51 mm (2×2 inches)",
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
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
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
                      <span className="ml-4 shrink-0 text-slate-500 group-open:rotate-90 transition-transform" aria-hidden="true">
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