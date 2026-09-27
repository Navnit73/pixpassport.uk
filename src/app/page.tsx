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
  Sparkles,
  Check,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";

const steps = [
  {
    icon: Globe,
    step: 1,
    title: "Select Country",
    description:
      "Choose from 50+ countries including UK, US, Australia, Canada, Schengen Area, and India with official biometric dimensions.",
  },
  {
    icon: Upload,
    step: 2,
    title: "Upload Photo",
    description:
      "Upload your photo. PixPassport automatically optimizes and compresses images to 3 MB without losing facial clarity.",
  },
  {
    icon: Zap,
    step: 3,
    title: "AI Process & Preview",
    description:
      "Takes 10 seconds to analyze biometrics, format dimensions, and generate verified previews with instant download.",
  },
];

const features = [
  {
    icon: Globe,
    title: "50+ Global Passport Formats",
    description:
      "Official dimensions for UK (600×750), US (600×600), Australia (413×531), Schengen (630×810), and 50+ countries.",
  },
  {
    icon: Zap,
    title: "Smart 3 MB Compression",
    description:
      "High-resolution canvas compression keeps file sizes under 3 MB without compromising facial details or sharpness.",
  },
  {
    icon: Shield,
    title: "Biometric AI Verification",
    description:
      "Automated head height, eye positioning, top margin clearance, and background validation checks.",
  },
  {
    icon: Printer,
    title: "Print Passport Photo Online",
    description:
      "Download high-resolution image and preview files ready for home printing on 6×4″ photo paper or high-street kiosks.",
  },
  {
    icon: Lock,
    title: "100% Free Forever",
    description:
      "No hidden fees, subscriptions, or watermarks. Create unlimited compliant passport photos for the whole family.",
  },
  {
    icon: Smartphone,
    title: "Fast & Mobile Friendly",
    description:
      "Works directly in your mobile or desktop browser with no app download or software installation required.",
  },
];

const pricingBenefits = [
  "Official biometric dimensions for 50+ countries",
  "Smart in-browser compression to ≤ 3 MB",
  "High-resolution single digital passport photo",
  "Standard 6×4″ (10×15 cm) multi-photo print sheet",
  "No watermark extortion or hidden charges",
  "No registration or credit card needed",
];

const faqs = [
  {
    question: "What are the official UK passport photo size requirements?",
    answer:
      "Official UK digital passport photos must be 600×750 pixels (or 35 mm wide by 45 mm high in print). The head height from chin to crown must measure between 29 mm and 34 mm (70–80% of image height).",
  },
  {
    question: "How does the 3 MB photo compression work?",
    answer:
      "When you upload an image, PixPassport automatically compresses and optimizes the file to 3 MB or less directly inside your browser while maintaining pristine facial sharpness and biometric standards.",
  },
  {
    question: "Which countries are supported by PixPassport?",
    answer:
      "PixPassport supports 53 countries worldwide including the United Kingdom, United States, Canada, Australia, India, Schengen European countries, Japan, China, Singapore, and New Zealand.",
  },
  {
    question: "How long does processing take?",
    answer:
      "Processing takes approximately 10 seconds. Our AI engine inspects eye level, facial centering, and background uniformity before generating your high-res digital photo and 6×4″ printable sheet.",
  },
  {
    question: "Can I print my passport photo at home or in a pharmacy?",
    answer:
      "Absolutely. You can download the high-resolution photo and print it at standard photo kiosks (Boots, Tesco, Walmart, pharmacies) or on home photo paper sized for 6×4 inches (10×15 cm).",
  },
  {
    question: "What file formats are supported?",
    answer:
      "PixPassport accepts JPEG, PNG, and WebP image files up to 20 MB in size. High-resolution camera photos from all modern smartphones are fully supported.",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd />

      <Navbar ctaText="Upload Photo" ctaHref="/passport-size-photo-maker" />

      <main className="flex-1 bg-base-100">
        {/* 1. HERO SECTION */}
        <section className="bg-base-100 section-padding border-b border-base-200" id="hero">
          <div className="container-narrow">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Copy column */}
              <div className="lg:col-span-7 max-w-2xl">
                <div className="inline-flex items-center gap-2 badge badge-primary badge-outline mb-5 py-3 px-3.5 text-xs sm:text-sm font-medium rounded-full">
                  <Globe className="w-3.5 h-3.5" />
                  <span>50+ Countries · UK Default (600×750 px)</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-base-content tracking-tight leading-[1.15] mb-5">
                  Create Your Digital Photo{" "}
                  <span className="text-primary block sm:inline">
                    for Passport Online
                  </span>
                </h1>

                <p className="text-base-content/75 text-base sm:text-lg mb-8 leading-relaxed">
                  PixPassport is a free passport photo maker that lets you create
                  compliant passport pictures online in seconds. Select your
                  country, upload any photo, auto-compress to 3&thinsp;MB with
                  maximum clarity, and get instant verified results.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-8">
                  <Link
                    href="/passport-size-photo-maker"
                    className="btn btn-primary btn-lg gap-2 text-base font-semibold shadow-sm hover:shadow-md"
                  >
                    <Upload className="w-5 h-5" />
                    Upload &amp; Create Photo
                    <ArrowRight className="w-4 h-4 ml-0.5" />
                  </Link>
                  <Link
                    href="/#how-it-works"
                    className="btn btn-outline btn-lg text-base"
                  >
                    See How It Works
                  </Link>
                </div>

                {/* Trust indicators */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs sm:text-sm text-base-content/70 pt-2 border-t border-base-200">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle className="w-4 h-4 text-success shrink-0" />
                    UK &amp; 50+ Countries
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle className="w-4 h-4 text-success shrink-0" />
                    Smart 3 MB Compression
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle className="w-4 h-4 text-success shrink-0" />
                    100% Free Forever
                  </span>
                </div>
              </div>

              {/* Visual preview column */}
              <div className="lg:col-span-5 flex justify-center w-full">
                <div className="w-full max-w-sm">
                  <div className="card bg-base-100 border border-base-300 rounded-2xl card-shadow overflow-hidden p-5 sm:p-6">
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-base-200">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
                        <span className="text-xs font-semibold text-base-content uppercase tracking-wider">
                          Official Format Ready
                        </span>
                      </div>
                      <span className="badge badge-success text-success-content text-xs font-bold">
                        Verified
                      </span>
                    </div>

                    {/* Passport Card Graphic */}
                    <div className="relative bg-base-200 rounded-xl aspect-[35/45] flex flex-col items-center justify-center p-4 overflow-hidden border border-base-300 shadow-inner">
                      <div className="relative w-28 h-36 rounded-lg overflow-hidden border-2 border-base-100 shadow-sm mb-3">
                        <Image
                          src="/pixpassport.jpg"
                          alt="Biometric Passport Sample"
                          fill
                          sizes="(max-width: 768px) 100vw, 150px"
                          className="object-cover"
                        />
                      </div>

                      <div className="text-center">
                        <p className="text-sm font-bold text-base-content">
                          United Kingdom (GB)
                        </p>
                        <p className="text-xs font-mono text-base-content/60">
                          600 × 750 px · 35 × 45 mm
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-base-200/80 border border-base-300/50">
                        <span className="text-base-content/70">Biometric Dimensions:</span>
                        <span className="font-mono font-bold text-base-content">
                          600×750 px
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-base-200/80 border border-base-300/50">
                        <span className="text-base-content/70">Background Cleaning:</span>
                        <span className="font-semibold text-success flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          Passed
                        </span>
                      </div>
                    </div>

                    <div className="mt-5">
                      <Link
                        href="/passport-size-photo-maker"
                        className="btn btn-primary btn-sm w-full gap-1.5 font-semibold"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Open Photo Studio
                      </Link>
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
                How to Create Your Passport Photo Online
              </h2>
              <p className="text-base-content/70 text-base">
                Three simple steps to an official biometric passport photo for
                the UK and 50+ countries.
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
                Why Choose PixPassport for Passport Photos?
              </h2>
              <p className="text-base-content/70 text-base">
                Everything you need to create, verify, and print official
                biometric passport photos from any device.
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

        {/* 4. PRICING / FREE SECTION */}
        <section className="bg-base-200/60 section-padding border-b border-base-200" id="pricing">
          <div className="container-narrow">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="badge badge-primary badge-outline text-xs font-medium mb-3">
                Zero Cost
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content mb-3">
                100% Free Passport Photo Maker
              </h2>
              <p className="text-base-content/70 text-base">
                No hidden costs. No subscriptions. No watermarks on your
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

        {/* 5. FAQ SECTION */}
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
                Common questions about country specifications, compression, and
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
