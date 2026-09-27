import Link from "next/link";
import Image from "next/image";
import {
  Upload,
  CheckCircle,
  Shield,
  Printer,
  Zap,
  Lock,
  Smartphone,
  Globe,
  ArrowRight,
  Crop,
  RefreshCw,
  BookOpenCheck,
  Users,
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
    title: "100% Free, No Watermark",
    description:
      "No subscriptions, no per-photo fees, and no watermark on your download. Create unlimited compliant photos for the whole family, free forever.",
  },
];

const pricingBenefits = [
  "Official biometric dimensions for 50+ countries",
  "Automatic passport picture cropping and resizing",
  "Smart in-browser compression to ≤ 3 MB",
  "High-resolution single digital passport photo",
  "Standard 6×4″ (10×15 cm) multi-photo print sheet",
  "No registration, watermark, or credit card needed",
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
      <JsonLd />

      <Navbar ctaText="Upload Photo" ctaHref="/passport-size-photo-maker" />

      <main className="flex-1 bg-base-100">
        {/* 1. HERO SECTION */}
        <section className="bg-white py-10 sm:py-16 border-b border-slate-200/80" id="hero">
          <div className="container-narrow">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left copy column */}
              <div className="lg:col-span-7 max-w-2xl">
                {/* Official Biometric Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#F4FBE8] border border-lime-300 text-xs font-bold text-[#4D7C0F] tracking-wide mb-5">
                  <span className="w-2 h-2 rounded-full bg-[#65A30D]" />
                  <span>OFFICIAL BIOMETRIC PHOTO TOOL · ICAO COMPLIANT</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0F172A] tracking-tight leading-[1.18] mb-3">
                  Create a Passport Picture Online in Seconds
                </h1>

                {/* Sub-heading */}
                <p className="text-lg sm:text-xl text-[#64748B] font-normal mb-4 leading-snug">
                  The UK passport photo maker for new applications and renewals
                </p>

                {/* Body description */}
                <p className="text-sm sm:text-base text-[#475569] leading-relaxed mb-7 max-w-xl">
                  Upload one photo and get a ready-to-submit digital photo for your
                  passport, visa, or passport renewal. We crop, resize, and check
                  your photo against official government rules for the UK, US,
                  Schengen Area, and 50+ other countries in under 10 seconds.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3.5 mb-7">
                  <Link
                    href="/passport-size-photo-maker"
                    className="inline-flex items-center justify-center gap-2 bg-[#4D7C0F] hover:bg-[#3F650C] text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-lg shadow-xs transition-colors"
                  >
                    Create My Passport Photo &rarr;
                  </Link>
                  <Link
                    href="/passport-size-photo-maker"
                    className="inline-flex items-center justify-center bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm sm:text-base px-6 py-3.5 rounded-lg border border-slate-300 shadow-xs transition-colors"
                  >
                    Check My Photo Free
                  </Link>
                </div>

                {/* Rating & Social Proof */}
                <div className="flex items-center gap-2.5 mb-6 text-sm">
                  <div className="flex items-center text-[#2563EB] gap-0.5">
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
                  <span className="text-slate-800 text-sm font-bold">
                    4.9 · <span className="font-normal text-slate-600">Trusted by 17,000+ users</span>
                  </span>
                </div>

                {/* Features Badges Row */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F8FAFC] border border-slate-200 text-xs font-medium text-slate-700">
                    <span>🔒</span> Secure &amp; Private
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F8FAFC] border border-slate-200 text-xs font-medium text-slate-700">
                    <span className="text-amber-500">⚡</span> Results in 10s
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F8FAFC] border border-slate-200 text-xs font-medium text-slate-700">
                    <span>🌍</span> 50+ Countries
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F8FAFC] border border-slate-200 text-xs font-medium text-slate-700">
                    <span>🪪</span> Free Validation
                  </span>
                </div>
              </div>

              {/* Visual preview column */}
              <div className="lg:col-span-5 flex justify-center w-full">
                <div className="w-full max-w-sm lg:max-w-md">
                  <div className="card  overflow-hidden p-3 sm:p-4">
                    <div className="relative rounded-xl overflow-hidden shadow-xs border border-base-200 aspect-[4/5]">
                      <Image
                        src="https://res.cloudinary.com/dipzpwbbk/image/upload/v1790507890/uk_passport_size_photo_i5uujz.jpg"
                        alt="Official UK Passport Size Photo Sample"
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
          </div>
        </section>

        {/* 2. HOW IT WORKS SECTION */}
        <section className="bg-base-200/60 section-padding border-b border-base-200" id="how-it-works">
          <div className="container-narrow">
            <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
              <span className="badge badge-primary badge-outline text-xs font-medium mb-3">
                Simple 3-Step Process
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content mb-3">
                How to Create a Digital Photo for Passport Online
              </h2>
              <p className="text-base-content/70 text-base">
                Three steps take you from a regular photo to an accepted
                biometric passport picture for the UK and 50+ countries.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {steps.map(({ icon: Icon, step, title, description }) => (
                <div
                  key={step}
                  className="card bg-base-100 border border-base-300 rounded-2xl card-shadow h-full"
                >
                  <div className="card-body items-start text-left p-6 sm:p-8 gap-4">
                    <div className="flex items-center justify-between w-full">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="badge badge-neutral badge-sm font-mono font-bold">
                        Step 0{step}
                      </span>
                    </div>

                    <h3 className="card-title text-base-content text-lg sm:text-xl font-bold">
                      {title}
                    </h3>

                    <p className="text-base-content/70 text-sm leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/passport-size-photo-maker"
                className="btn btn-primary btn-lg gap-2 text-base font-semibold shadow-sm"
              >
                <Upload className="w-5 h-5" />
                Upload &amp; Create Photo Now
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* 3. FEATURES SECTION */}
        <section className="bg-base-100 section-padding border-b border-base-200" id="features">
          <div className="container-narrow">
            <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
              <span className="badge badge-primary badge-outline text-xs font-medium mb-3">
                Engineered for Acceptance
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content mb-3">
                Everything You Need From a UK Passport Photo Maker
              </h2>
              <p className="text-base-content/70 text-base">
                Create, crop, verify, and print official biometric passport
                photos from any device, for a first application or a renewal.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="card bg-base-100 border border-base-300 rounded-2xl hover:border-primary/50 transition-colors p-6 sm:p-7 gap-3.5 card-shadow"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="font-bold text-base-content text-base sm:text-lg">
                    {title}
                  </h3>

                  <p className="text-base-content/70 text-sm leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. TRUST / E-E-A-T SECTION */}
        <section className="bg-base-200/60 section-padding border-b border-base-200" id="trust">
          <div className="container-narrow">
            <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
              <span className="badge badge-primary badge-outline text-xs font-medium mb-3">
                Why Trust PixPassport
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content mb-3">
                Photo Rules You Can Verify, Not Just Trust
              </h2>
              <p className="text-base-content/70 text-base">
                We built PixPassport with applicants and immigration document
                specialists, and we keep every country profile current.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {trustPoints.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="card bg-base-100 border border-base-300 rounded-2xl p-6 sm:p-7 gap-3 card-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-base-content text-base sm:text-lg">
                      {title}
                    </h3>
                  </div>
                  <p className="text-base-content/70 text-sm leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. PRICING / FREE SECTION */}
        <section className="bg-base-100 section-padding border-b border-base-200" id="pricing">
          <div className="container-narrow">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="badge badge-primary badge-outline text-xs font-medium mb-3">
                Zero Cost
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content mb-3">
                100% Free Passport Photo Maker
              </h2>
              <p className="text-base-content/70 text-base">
                No hidden costs, no subscriptions, and no watermarks on your
                downloads.
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="card bg-base-100 border-2 border-primary rounded-2xl shadow-xl overflow-hidden">
                <div className="card-body p-6 sm:p-8 gap-6">
                  <div className="text-center">
                    <div className="badge badge-primary mb-3 font-semibold text-xs">
                      Free Forever Plan
                    </div>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-extrabold text-base-content tracking-tight">
                        £0
                      </span>
                      <span className="text-base-content/60 text-base font-medium">
                        /photo
                      </span>
                    </div>
                    <p className="text-base-content/70 text-xs sm:text-sm mt-2">
                      Completely free — no payment or credit card required
                    </p>
                  </div>

                  <div className="divider my-0" />

                  <ul className="space-y-3">
                    {pricingBenefits.map((benefit) => (
                      <li
                        key={benefit}
                        className="flex items-start gap-2.5 text-base-content/85 text-sm"
                      >
                        <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/passport-size-photo-maker"
                    className="btn btn-primary btn-lg w-full text-base font-semibold shadow-sm mt-2"
                  >
                    Create Your Passport Photo Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. FAQ SECTION */}
        <section className="bg-base-100 section-padding" id="faq">
          <div className="container-narrow">
            <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
              <span className="badge badge-primary badge-outline text-xs font-medium mb-3">
                Got Questions?
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-base-content/70 text-base">
                Common questions about country rules, renewals, cropping, and
                printing.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-3.5">
              {faqs.map(({ question, answer }, index) => (
                <div
                  key={index}
                  className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-xl"
                >
                  <input
                    type="radio"
                    name="faq-accordion"
                    id={`faq-${index}`}
                    defaultChecked={index === 0}
                    aria-label={question}
                  />
                  <div className="collapse-title font-semibold text-base-content text-base sm:text-lg">
                    {question}
                  </div>
                  <div className="collapse-content text-base-content/75 text-sm sm:text-base leading-relaxed">
                    <p>{answer}</p>
                  </div>
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