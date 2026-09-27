"use client";

import {
  useState,
  useRef,
  type ChangeEvent,
  type DragEvent,
} from "react";
import {
  Camera,
  Upload,
  CheckCircle,
  ImagePlus,
  X,
  AlertCircle,
  Crop,
  Download,
  Ruler,
  Shield,
  Printer,
  Zap,
  Lock,
  Smartphone,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const steps = [
  {
    icon: Upload,
    step: 1,
    title: "Upload",
    description:
      "Upload a high-quality photo taken against a plain background. JPEG, PNG, or WebP accepted.",
  },
  {
    icon: Crop,
    step: 2,
    title: "Adjust",
    description:
      "Position and crop your photo to meet the official 35 mm × 45 mm UK passport specification.",
  },
  {
    icon: Download,
    step: 3,
    title: "Download & Print",
    description:
      "Download your print-ready digital photo for passport applications or renewals, sized for home or pharmacy printing.",
  },
];

const features = [
  {
    icon: Ruler,
    title: "Official 35 mm × 45 mm Format",
    description:
      "Photos are automatically sized to the official dimensions required for UK passport applications and renewals.",
  },
  {
    icon: Shield,
    title: "UK Passport Specification",
    description:
      "Built-in checks help ensure your digital photo for passport meets the dimensional requirements before you download.",
  },
  {
    icon: Printer,
    title: "Print Passport Photo Online",
    description:
      "Download a high-resolution file sized for standard 6×4″ photo paper — ready for home or pharmacy printing.",
  },
  {
    icon: Zap,
    title: "Instant Processing",
    description:
      "Your photo is processed entirely in-browser. No uploads to external servers and no waiting.",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description:
      "Photos never leave your device. All processing happens locally with no data stored or transmitted.",
  },
  {
    icon: Smartphone,
    title: "Works on Any Device",
    description:
      "Fully responsive — create your passport picture online from desktop, tablet, or mobile browsers.",
  },
];

const pricingBenefits = [
  "Unlimited passport photos",
  "35 mm × 45 mm UK format",
  "High-resolution download",
  "In-browser processing",
  "No account required",
  "Print-ready 6×4″ layout",
];

const faqs = [
  {
    question: "What are the official UK passport photo requirements?",
    answer:
      "UK passport photos must be 35 mm wide × 45 mm tall, with a plain white or light grey background. Your face must be clearly visible with a neutral expression, mouth closed, and eyes open. The photo must be in sharp focus with no red-eye. PixPassport automatically sizes your photo to meet these requirements.",
  },
  {
    question: "How do I create a digital photo for passport renewal?",
    answer:
      "Upload a recent, well-lit photo of yourself to PixPassport. The tool will help you crop and adjust it to the official 35 mm × 45 mm dimensions. You can then download the digital photo for your passport renewal application, ready to submit online or print at home.",
  },
  {
    question: "Is PixPassport really free?",
    answer:
      "Yes, PixPassport is completely free with no hidden charges. You can create and download as many passport photos as you need without paying anything or creating an account.",
  },
  {
    question: "Are photos processed on your servers?",
    answer:
      "No. All photo processing happens entirely within your web browser. Your photos are never uploaded to any server, ensuring complete privacy. Once you close the page, no trace of your photo remains.",
  },
  {
    question: "Can I print my passport photo at home?",
    answer:
      "Absolutely. The download includes a print-ready file sized for standard 6×4 inch (10×15 cm) photo paper, which you can print at home or at any pharmacy or printing service.",
  },
  {
    question: "Will my photo be accepted by HM Passport Office?",
    answer:
      "PixPassport formats your photo to meet the official HMPO dimensional requirements. However, the quality and suitability of the original photo (lighting, expression, background) is your responsibility. We recommend following the tips provided in the upload section.",
  },
  {
    question: "What file formats are supported?",
    answer:
      "PixPassport accepts JPEG, PNG, and WebP image files up to 10 MB in size. For best results, use a high-resolution photo with good lighting.",
  },
];

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function validate(f: File): string | null {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      return "Please upload a JPEG, PNG, or WebP image.";
    }
    if (f.size > MAX_FILE_SIZE_BYTES) {
      return `File must be smaller than ${MAX_FILE_SIZE_MB} MB.`;
    }
    return null;
  }

  function handleFile(f: File) {
    const err = validate(f);
    if (err) {
      setError(err);
      setFile(null);
      setPreview(null);
      return;
    }

    setError(null);
    setFile(f);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(f);
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  }

  function onDragOver(e: DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function onDragLeave(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }

  function clearFile() {
    setFile(null);
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleProcess() {
    if (!file) return;
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 2000);
  }

  return (
    <>
      <JsonLd />

      <Navbar />

      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="bg-base-100 section-padding" id="hero">
          <div className="container-narrow">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Copy */}
              <div className="max-w-xl">
                <h1 className="text-base-content mb-6">
                  Create Your Digital Photo
                  <span className="block text-primary">
                    for Passport Online
                  </span>
                </h1>

                <p className="text-base-content/70 text-lg mb-8 leading-relaxed">
                  PixPassport is a free UK passport photo maker that lets you
                  create a passport picture online in under two minutes. Upload
                  your photo, adjust it to the official
                  35&thinsp;mm&nbsp;×&nbsp;45&thinsp;mm dimensions, and print
                  your passport photo online — all from your browser, with no
                  registration required.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <a href="#upload" className="btn btn-primary btn-lg gap-2">
                    <Upload className="w-5 h-5" />
                    Upload Your Photo
                  </a>
                  <a href="#how-it-works" className="btn btn-outline btn-lg">
                    See How It Works
                  </a>
                </div>

                {/* Trust indicators */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-base-content/60">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-success" />
                    Free to use
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-success" />
                    No sign-up needed
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-success" />
                    35 mm × 45 mm format
                  </span>
                </div>
              </div>

              {/* Visual preview */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-4 bg-base-200 rounded-2xl -z-10" />

                  <div className="card bg-base-100 border border-base-300 p-6 w-72">
                    <div className="bg-base-200 rounded-lg aspect-[35/45] flex flex-col items-center justify-center gap-3">
                      <Camera className="w-12 h-12 text-base-content/30" />
                      <p className="text-base-content/40 text-sm font-medium font-mono">
                        35 mm × 45 mm
                      </p>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-base-content/60">
                        <CheckCircle className="w-3.5 h-3.5 text-success" />
                        Correct dimensions
                      </div>
                      <div className="flex items-center gap-2 text-xs text-base-content/60">
                        <CheckCircle className="w-3.5 h-3.5 text-success" />
                        White background
                      </div>
                      <div className="flex items-center gap-2 text-xs text-base-content/60">
                        <CheckCircle className="w-3.5 h-3.5 text-success" />
                        Ready to print
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. UPLOAD CARD SECTION */}
        <section className="bg-base-200 section-padding" id="upload">
          <div className="container-narrow">
            <div className="text-center mb-12">
              <h2 className="text-base-content mb-4">
                Create Your Passport Picture Online
              </h2>
              <p className="text-base-content/60 text-lg max-w-2xl mx-auto">
                Upload a well-lit photo taken against a plain background to
                create a digital photo for your passport application or renewal.
              </p>
            </div>

            <div className="max-w-xl mx-auto">
              <div className="card bg-base-100 border border-base-300 card-shadow">
                <div className="card-body gap-6">
                  {/* Error alert */}
                  {error && (
                    <div
                      role="alert"
                      aria-live="polite"
                      className="alert alert-error"
                    >
                      <AlertCircle className="w-5 h-5" />
                      <span>{error}</span>
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={() => setError(null)}
                        aria-label="Dismiss error"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Drag-and-drop / preview area */}
                  {!preview ? (
                    <div
                      className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                        isDragging
                          ? "border-primary bg-primary/5"
                          : "border-base-300 hover:border-primary/50"
                      }`}
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onDrop={onDrop}
                      onClick={() => inputRef.current?.click()}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          inputRef.current?.click();
                        }
                      }}
                      aria-label="Upload photo area. Click or drag and drop."
                    >
                      <ImagePlus className="w-10 h-10 text-base-content/30 mx-auto mb-3" />
                      <p className="text-base-content/70 font-medium mb-1">
                        Drag &amp; drop your photo here
                      </p>
                      <p className="text-base-content/50 text-sm">
                        or click to browse · JPEG, PNG, WebP · Max{" "}
                        {MAX_FILE_SIZE_MB} MB
                      </p>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="bg-base-200 rounded-xl p-4 flex justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={preview}
                          alt="Uploaded passport photo preview ready for adjustment"
                          className="max-h-72 rounded-lg object-contain"
                        />
                      </div>
                      <button
                        className="btn btn-circle btn-sm btn-ghost absolute top-2 right-2"
                        onClick={clearFile}
                        aria-label="Remove uploaded photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Hidden file input */}
                  <input
                    ref={inputRef}
                    type="file"
                    accept={ACCEPTED_TYPES.join(",")}
                    onChange={onFileChange}
                    className="hidden"
                    id="photo-upload"
                    aria-label="Select photo file"
                  />

                  {/* File info & actions */}
                  {file && (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-sm text-base-content/60">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="truncate">{file.name}</span>
                        <span className="text-base-content/40 font-mono text-xs">
                          ({(file.size / 1024 / 1024).toFixed(1)} MB)
                        </span>
                      </div>

                      <button
                        className="btn btn-primary w-full gap-2"
                        onClick={handleProcess}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <span className="loading loading-spinner loading-sm" />
                            Processing…
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            Create Passport Photo
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Tips */}
                  {!file && (
                    <div className="text-xs text-base-content/50 space-y-1">
                      <p className="font-medium text-base-content/60">
                        Photo tips:
                      </p>
                      <ul className="list-disc pl-4 space-y-0.5">
                        <li>
                          Face the camera directly with a neutral expression
                        </li>
                        <li>Use a plain white or light grey background</li>
                        <li>
                          Ensure even lighting with no shadows on your face
                        </li>
                        <li>
                          Remove glasses, hats, and head coverings (unless
                          religious)
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. HOW IT WORKS SECTION */}
        <section className="bg-base-100 section-padding" id="how-it-works">
          <div className="container-narrow">
            <div className="text-center mb-14">
              <h2 className="text-base-content mb-4">
                How to Create a Digital Photo for Passport Renewal
              </h2>
              <p className="text-base-content/60 text-lg max-w-2xl mx-auto">
                Three simple steps to a print-ready UK passport photo — no
                appointments, no queues.
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
          </div>
        </section>

        {/* 4. FEATURES SECTION */}
        <section className="bg-base-200 section-padding" id="features">
          <div className="container-narrow">
            <div className="text-center mb-14">
              <h2 className="text-base-content mb-4">
                Why Use PixPassport as Your UK Passport Photo Maker?
              </h2>
              <p className="text-base-content/60 text-lg max-w-2xl mx-auto">
                Everything you need to create a digital photo for passport
                applications — fast, private, and completely free.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="card bg-base-100 border border-base-300 card-shadow"
                >
                  <div className="card-body gap-3">
                    <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="card-title text-base-content text-lg">
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

        {/* 5. PRICING SECTION */}
        <section className="bg-base-100 section-padding" id="pricing">
          <div className="container-narrow">
            <div className="text-center mb-14">
              <h2 className="text-base-content mb-4">
                Free UK Passport Photo Maker
              </h2>
              <p className="text-base-content/60 text-lg max-w-2xl mx-auto">
                No hidden fees, no subscriptions. Create a digital photo for
                passport applications at zero cost.
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
                      Completely free — no payment ever required
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

                  <a
                    href="#upload"
                    className="btn btn-primary btn-lg w-full mt-2"
                  >
                    Create Your Passport Photo — Free
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. FAQ SECTION */}
        <section className="bg-base-200 section-padding" id="faq">
          <div className="container-narrow">
            <div className="text-center mb-14">
              <h2 className="text-base-content mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-base-content/60 text-lg max-w-2xl mx-auto">
                Common questions about creating your UK passport photo online.
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
