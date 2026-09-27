import Link from "next/link";
import {
  Camera,
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
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";

const steps = [
  {
    icon: Globe,
    step: 1,
    title: "1. Select Country",
    description:
      "Choose from 50+ countries including UK, US, Australia, Canada, Schengen Area, and India with official biometric dimensions.",
  },
  {
    icon: Upload,
    step: 2,
    title: "2. Upload Photo",
    description:
      "Upload your photo. PixPassport automatically optimizes and compresses images to 3 MB without losing facial clarity.",
  },
  {
    icon: Zap,
    step: 3,
    title: "3. AI Process & Preview",
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

      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="bg-base-100 section-padding" id="hero">
          <div className="container-narrow">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Copy */}
              <div className="max-w-xl">
                <div className="badge badge-primary badge-outline mb-4 gap-1.5 py-3 px-4 text-sm font-medium">
                  <Globe className="w-4 h-4" />
                  50+ Countries Supported · UK By Default
                </div>

                <h1 className="text-base-content mb-6">
                  Create Your Digital Photo
                  <span className="block text-primary">
                    for Passport Online
                  </span>
                </h1>

                <p className="text-base-content/70 text-lg mb-8 leading-relaxed">
                  PixPassport is a free passport photo maker that lets you create
                  compliant passport pictures online in under two minutes. Select
                  your country, upload any photo, auto-compress to 3&thinsp;MB
                  with maximum clarity, and get instant verified results.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <Link
                    href="/passport-size-photo-maker"
                    className="btn btn-primary btn-lg gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    Upload &amp; Create Photo
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                  <a href="#how-it-works" className="btn btn-outline btn-lg">
                    See How It Works
                  </a>
                </div>

                {/* Trust indicators */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-base-content/60">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-success shrink-0" />
                    UK &amp; 50+ Countries
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-success shrink-0" />
                    Smart 3 MB Compression
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-success shrink-0" />
                    100% Free Forever
                  </span>
                </div>
              </div>

              {/* Visual preview */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-4 bg-base-200 rounded-2xl -z-10" />

                  <div className="card bg-base-100 border border-base-300 p-6 w-76">
                    <div className="bg-base-200 rounded-lg aspect-[35/45] flex flex-col items-center justify-center gap-3 relative overflow-hidden border border-base-300">
                      <Camera className="w-12 h-12 text-base-content/30" />
                      <div className="text-center">
                        <p className="text-base-content/70 font-semibold text-sm">
                          United Kingdom
                        </p>
                        <p className="text-base-content/40 text-xs font-mono">
                          600×750 px (GB)
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-xs text-base-content/70">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-success" />
                          Dimensions
                        </span>
                        <span className="font-mono font-medium">600×750 px</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-base-content/70">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-success" />
                          Document
                        </span>
                        <span className="capitalize font-medium">Passport</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-base-content/70">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-success" />
                          AI Background
                        </span>
                        <span className="text-success font-medium">
                          Auto-Correct
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-base-200">
                      <Link
                        href="/passport-size-photo-maker"
                        className="btn btn-primary btn-sm w-full gap-1.5"
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
        <section className="bg-base-200 section-padding" id="how-it-works">
          <div className="container-narrow">
            <div className="text-center mb-14">
              <h2 className="text-base-content mb-4">
                How to Create Your Passport Photo Online
              </h2>
              <p className="text-base-content/60 text-lg max-w-2xl mx-auto">
                Three simple steps to an official biometric passport photo for
                the UK and 50+ countries.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {steps.map(({ icon: Icon, step, title, description }) => (
                <div
                  key={step}
                  className="card bg-base-100 border border-base-300 card-shadow"
                >
                  <div className="card-body items-center text-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>

                    <div className="badge badge-primary badge-sm font-mono">
                      Step {step}
                    </div>

                    <h3 className="card-title text-base-content text-xl">
                      {title}
                    </h3>

                    <p className="text-base-content/60 text-sm leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/passport-size-photo-maker"
                className="btn btn-primary btn-lg gap-2"
              >
                <Upload className="w-5 h-5" />
                Upload &amp; Create Photo Now
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* 3. FEATURES SECTION */}
        <section className="bg-base-100 section-padding" id="features">
          <div className="container-narrow">
            <div className="text-center mb-14">
              <h2 className="text-base-content mb-4">
                Why Choose PixPassport for Global Passport Photos?
              </h2>
              <p className="text-base-content/60 text-lg max-w-2xl mx-auto">
                Everything you need to create, verify, and print official
                biometric passport photos from any device.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="card bg-base-100 border border-base-300 hover:border-primary/50 transition-colors"
                >
                  <div className="card-body gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>

                    <h3 className="font-bold text-base-content text-lg">
                      {title}
                    </h3>

                    <p className="text-base-content/60 text-sm leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. PRICING / FREE SECTION */}
        <section className="bg-base-200 section-padding" id="pricing">
          <div className="container-narrow">
            <div className="text-center mb-12">
              <h2 className="text-base-content mb-4">
                100% Free Passport Photo Maker
              </h2>
              <p className="text-base-content/60 text-lg max-w-2xl mx-auto">
                No hidden costs. No subscriptions. No watermarks on your
                downloads.
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="card bg-base-100 border-2 border-primary card-shadow">
                <div className="card-body gap-6">
                  <div className="text-center">
                    <div className="badge badge-primary mb-3 font-medium">
                      Free Forever
                    </div>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-bold text-base-content">
                        £0
                      </span>
                      <span className="text-base-content/50 text-lg">
                        /photo
                      </span>
                    </div>
                    <p className="text-base-content/60 text-sm mt-2">
                      Completely free — no payment or credit card required
                    </p>
                  </div>

                  <div className="divider my-0" />

                  <ul className="space-y-3">
                    {pricingBenefits.map((benefit) => (
                      <li
                        key={benefit}
                        className="flex items-center gap-3 text-base-content/80 text-sm"
                      >
                        <CheckCircle className="w-4.5 h-4.5 text-success shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/passport-size-photo-maker"
                    className="btn btn-primary btn-lg w-full mt-2"
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
            <div className="text-center mb-14">
              <h2 className="text-base-content mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-base-content/60 text-lg max-w-2xl mx-auto">
                Common questions about country specifications, compression, and
                printing.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-3">
              {faqs.map(({ question, answer }, index) => (
                <div
                  key={index}
                  className="collapse collapse-arrow bg-base-100 border border-base-300"
                >
                  <input
                    type="radio"
                    name="faq-accordion"
                    id={`faq-${index}`}
                    defaultChecked={index === 0}
                    aria-label={question}
                  />
                  <div className="collapse-title font-semibold text-base-content">
                    {question}
                  </div>
                  <div className="collapse-content text-base-content/70 text-sm leading-relaxed">
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
