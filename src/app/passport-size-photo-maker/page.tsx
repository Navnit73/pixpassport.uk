"use client";

import {
  useState,
  useRef,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Upload,
  ImagePlus,
  X,
  AlertCircle,
  Globe,
  CheckCircle,
  Zap,
  ArrowRight,
  Shield,
  Sparkles,
  Camera,
  Check,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import {
  COUNTRIES,
  DEFAULT_COUNTRY,
  getCountryByCode,
  type CountryPassportConfig,
} from "@/config/countries";
import {
  compressImageTo3MB,
  type CompressionResult,
} from "@/lib/image-compress";
import type { PassportProcessResult } from "@/lib/passport-api";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_MB = 20;

const PROCESSING_STEPS = [
  { text: "Analyzing biometric facial landmarks & eye position…", progress: 25 },
  { text: "Validating background uniformity & removing shadows…", progress: 50 },
  { text: "Aligning dimensions to official country standards…", progress: 75 },
  { text: "Finalizing ultra-high-resolution print preview…", progress: 95 },
];

export default function PassportSizePhotoMakerPage() {
  const router = useRouter();

  // Country selection (Default: United Kingdom)
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("GB");
  const selectedCountry: CountryPassportConfig =
    getCountryByCode(selectedCountryCode) || DEFAULT_COUNTRY;

  // File and state
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState<CompressionResult | null>(
    null
  );

  // 10-Second Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStepIndex, setProcessingStepIndex] = useState(0);
  const [countdown, setCountdown] = useState(10);
  const inputRef = useRef<HTMLInputElement>(null);

  // Validation
  function validate(f: File): string | null {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      return "Please upload a JPEG, PNG, or WebP image.";
    }
    if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `File must be smaller than ${MAX_FILE_SIZE_MB} MB.`;
    }
    return null;
  }

  async function handleFile(f: File) {
    const err = validate(f);
    if (err) {
      setError(err);
      setFile(null);
      setPreview(null);
      setCompressionInfo(null);
      return;
    }

    setError(null);
    setFile(f); // Immediately update file state to prevent stale uploads

    // Initial preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(f);

    // Auto-compress to <= 3 MB
    try {
      const compResult = await compressImageTo3MB(f);
      setFile(compResult.file);
      setCompressionInfo(compResult);
    } catch {
      setFile(f);
      setCompressionInfo(null);
    }
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      handleFile(f);
      // Reset input value so re-selecting any file fires change event
      e.target.value = "";
    }
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
    setCompressionInfo(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleProcess() {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setProcessingProgress(0);
    setProcessingStepIndex(0);
    setCountdown(10);

    const startTime = Date.now();
    const TOTAL_DURATION_MS = 10000; // 10 seconds total

    // Start 10-second timer animation
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPct = Math.min(100, Math.round((elapsed / TOTAL_DURATION_MS) * 100));
      setProcessingProgress(progressPct);

      const remainingSec = Math.max(0, Math.ceil((TOTAL_DURATION_MS - elapsed) / 1000));
      setCountdown(remainingSec);

      if (progressPct >= 75) {
        setProcessingStepIndex(3);
      } else if (progressPct >= 50) {
        setProcessingStepIndex(2);
      } else if (progressPct >= 25) {
        setProcessingStepIndex(1);
      } else {
        setProcessingStepIndex(0);
      }
    }, 100);

    try {
      const uploadFile = file;
      const fileExt = uploadFile.name.split(".").pop() || "jpg";
      const fileName = `upload_${Date.now()}.${fileExt}`;
      const freshFile = new File([uploadFile], fileName, { type: uploadFile.type });

      const formData = new FormData();
      formData.append("image", freshFile);
      formData.append("country_code", selectedCountry.country_code);
      formData.append("document_type", selectedCountry.document_type || "passport");

      // Dispatch API call in parallel
      const apiPromise = fetch("/api/passport-photo", {
        method: "POST",
        body: formData,
      }).then(async (res) => {
        const data: PassportProcessResult = await res.json();
        if (!res.ok || data.status === "error" || data.error) {
          throw new Error(data.error || "Failed to process passport photo.");
        }
        return data;
      });

      // Ensure at least 10 seconds elapse for the full animation
      const [apiResult] = await Promise.all([
        apiPromise,
        new Promise((res) => setTimeout(res, TOTAL_DURATION_MS)),
      ]);

      clearInterval(interval);
      setProcessingProgress(100);

      const resultId =
        apiResult.result_id ||
        `res_${selectedCountryCode.toLowerCase()}_${Date.now()}`;

      const payload = {
        ...apiResult,
        result_id: resultId,
        country_code: selectedCountry.country_code,
        country_name: selectedCountry.country_name,
        target_dimensions: selectedCountry.dimensions,
        document_type: selectedCountry.document_type,
        original_preview: preview,
        timestamp: Date.now(),
      };

      // Store result in sessionStorage and localStorage
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem(`pixpassport_${resultId}`, JSON.stringify(payload));
          sessionStorage.setItem("pixpassport_latest", JSON.stringify(payload));
          localStorage.setItem(`pixpassport_${resultId}`, JSON.stringify(payload));
          localStorage.setItem("pixpassport_latest", JSON.stringify(payload));
        } catch {
          // fallback
        }
      }

      // Navigate to preview page with ID
      router.push(`/preview/${resultId}`);
    } catch (err: unknown) {
      clearInterval(interval);
      setIsProcessing(false);
      const msg =
        err instanceof Error
          ? err.message
          : "An error occurred while communicating with the PixPassport API.";
      setError(msg);
    }
  }

  return (
    <>
      <JsonLd
        description={`Create official passport size photos for ${selectedCountry.country_name} (${selectedCountry.dimensions} px). In-browser 3MB compression and instant compliance verification.`}
      />

      <Navbar ctaText="Home" ctaHref="/" />

      <main className="flex-1 bg-base-100 min-h-screen py-8 sm:py-12" id="studio">
        <div className="container-narrow">
          {/* Breadcrumb & Header */}
          <div className="mb-8">
            <nav className="text-xs sm:text-sm text-base-content/60 mb-3" aria-label="Breadcrumbs">
              <ol className="flex items-center gap-1.5 list-none p-0 m-0">
                <li>
                  <Link href="/" className="hover:text-primary transition-colors">
                    Home
                  </Link>
                </li>
                <li>/</li>
                <li className="text-base-content font-medium">
                  Passport Size Photo Maker
                </li>
              </ol>
            </nav>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-base-content tracking-tight">
                  Passport Size Photo Maker
                </h1>
                <p className="text-base-content/70 text-sm sm:text-base mt-1.5">
                  Select your country, upload your photo, and let AI format
                  official biometric dimensions.
                </p>
              </div>

              <div className="badge badge-primary badge-outline py-3 px-3.5 font-mono text-xs sm:text-sm self-start md:self-auto rounded-full">
                <Globe className="w-3.5 h-3.5 mr-1.5" />
                {selectedCountry.country_name}: {selectedCountry.dimensions} px
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Main Interactive Studio Column */}
            <div className="lg:col-span-8 space-y-6">
              <div className="card bg-base-100 border border-base-300 rounded-2xl card-shadow">
                <div className="card-body gap-6 p-5 sm:p-8">
                  {/* Step 1: Country Selector */}
                  <div>
                    <label
                      htmlFor="country-select"
                      className="block text-sm font-semibold text-base-content mb-2 flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-primary" />
                        1. Select Destination / Nationality:
                      </span>
                      <span className="badge badge-primary badge-sm text-xs font-semibold">
                        UK Default
                      </span>
                    </label>

                    <select
                      id="country-select"
                      value={selectedCountryCode}
                      onChange={(e) => setSelectedCountryCode(e.target.value)}
                      disabled={isProcessing}
                      className="select select-bordered w-full text-base-content font-medium bg-base-100 text-sm sm:text-base rounded-xl"
                      aria-label="Select target country"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.country_code} value={c.country_code}>
                          {c.country_name} ({c.country_code}) — {c.dimensions} px
                          ({c.document_type})
                        </option>
                      ))}
                    </select>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-base-content/75 bg-base-200/80 p-3 rounded-xl border border-base-300/60">
                      <span className="font-semibold text-base-content">
                        Preset Dimensions:
                      </span>
                      <span className="badge badge-neutral badge-sm font-mono font-bold">
                        {selectedCountry.dimensions} px
                      </span>
                      <span className="badge badge-outline badge-sm capitalize">
                        Official {selectedCountry.document_type}
                      </span>
                    </div>
                  </div>

                  <div className="divider my-0" />

                  {/* Error Alert */}
                  {error && (
                    <div
                      role="alert"
                      aria-live="polite"
                      className="alert alert-error rounded-xl text-sm"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span className="flex-1">{error}</span>
                      <button
                        className="btn btn-ghost btn-xs btn-circle"
                        onClick={() => setError(null)}
                        aria-label="Dismiss error"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Step 2: Upload Area */}
                  <div>
                    <label className="block text-sm font-semibold text-base-content mb-2 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-primary" />
                      2. Upload Your Photo (Smart 3 MB Auto-Compression):
                    </label>

                    {!preview ? (
                      <div
                        className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-colors ${
                          isDragging
                            ? "border-primary bg-primary/5"
                            : "border-base-300 hover:border-primary/50 bg-base-200/30"
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
                        <ImagePlus className="w-12 h-12 text-base-content/35 mx-auto mb-3" />
                        <p className="text-base-content font-bold text-base sm:text-lg mb-1">
                          Drag &amp; drop your photo here
                        </p>
                        <p className="text-base-content/60 text-xs sm:text-sm mb-3">
                          or click to browse from your device · JPEG, PNG, WebP
                        </p>
                        <span className="badge badge-outline badge-sm text-xs text-base-content/70">
                          Automatic high-clarity compression to ≤ 3 MB
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="relative bg-base-200 rounded-2xl p-4 flex justify-center border border-base-300 shadow-inner">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={preview}
                            alt="Uploaded passport photo preview"
                            className="max-h-72 sm:max-h-80 rounded-xl object-contain shadow-xs border border-base-100"
                          />
                          {!isProcessing && (
                            <button
                              className="btn btn-circle btn-sm btn-ghost absolute top-3 right-3 bg-base-100/90 backdrop-blur-xs hover:bg-base-100 shadow-sm"
                              onClick={clearFile}
                              aria-label="Remove uploaded photo"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* Compression info badge */}
                        {compressionInfo && (
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs bg-base-200/90 p-3 rounded-xl border border-base-300">
                            <span className="flex items-center gap-1.5 text-base-content font-medium">
                              <Check className="w-4 h-4 text-success shrink-0" />
                              {compressionInfo.compressed
                                ? "Compressed to ≤ 3 MB without loss of quality"
                                : "Photo size verified (within 3 MB limit)"}
                            </span>
                            <span className="font-mono text-base-content/70 text-xs shrink-0">
                              {compressionInfo.finalSizeKB} KB
                              {compressionInfo.compressed &&
                                ` (was ${compressionInfo.originalSizeKB} KB)`}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    <input
                      ref={inputRef}
                      type="file"
                      accept={ACCEPTED_TYPES.join(",")}
                      onChange={onFileChange}
                      className="hidden"
                      id="photo-file-input"
                      aria-label="Select photo file"
                    />
                  </div>

                  {/* Step 3: Action Button */}
                  {file && !isProcessing && (
                    <div className="pt-2">
                      <button
                        className="btn btn-primary w-full btn-lg gap-2 text-base font-semibold shadow-sm"
                        onClick={handleProcess}
                      >
                        <Zap className="w-5 h-5" />
                        Process for {selectedCountry.country_name} (
                        {selectedCountry.dimensions} px)
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                      <p className="text-center text-xs text-base-content/60 mt-2.5">
                        Takes approx. 10 seconds to analyze biometrics &amp; generate
                        high-resolution print preview.
                      </p>
                    </div>
                  )}

                  {/* Guidelines Checklist */}
                  {!file && (
                    <div className="text-xs text-base-content/70 space-y-2 pt-4 border-t border-base-200">
                      <p className="font-bold text-base-content">
                        Passport Photo Acceptance Guidelines:
                      </p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Look straight into the camera with a neutral expression</li>
                        <li>Ensure even lighting across face and shoulders</li>
                        <li>Eyes fully visible without tinted lenses or thick frames</li>
                        <li>Head coverings permitted for religious/medical reasons</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Country Info Column */}
            <div className="lg:col-span-4 space-y-6">
              <div className="card bg-base-100 border border-base-300 rounded-2xl card-shadow">
                <div className="card-body gap-4 p-6">
                  <h3 className="font-bold text-base text-base-content flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    {selectedCountry.country_name} Standards
                  </h3>

                  <div className="space-y-3 text-xs text-base-content/75">
                    <div className="flex justify-between py-1.5 border-b border-base-200">
                      <span>Country Code:</span>
                      <span className="font-mono font-bold text-base-content">
                        {selectedCountry.country_code}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-base-200">
                      <span>Target Dimensions:</span>
                      <span className="font-mono font-bold text-base-content">
                        {selectedCountry.dimensions} px
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-base-200">
                      <span>Document Type:</span>
                      <span className="capitalize font-bold text-base-content">
                        {selectedCountry.document_type}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-base-200">
                      <span>Max File Size:</span>
                      <span className="font-bold text-success">
                        Auto ≤ 3 MB
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span>Background:</span>
                      <span className="text-success font-semibold">
                        Auto AI Cleaned
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="card bg-primary/5 border border-primary/20 rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  100% Free &amp; Private
                </div>
                <p className="text-xs text-base-content/75 leading-relaxed">
                  Your photos are securely processed in compliance with official
                  biometric criteria and never permanently stored.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 10-SECOND PROCESSING MODAL OVERLAY */}
        {isProcessing && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="processing-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-neutral/80 backdrop-blur-sm p-4 animate-fade-in"
          >
            <div className="card bg-base-100 max-w-md w-full shadow-2xl border border-base-300 rounded-2xl overflow-hidden">
              <div className="card-body text-center p-6 sm:p-8 gap-5">
                <div className="relative mx-auto">
                  <div className="w-18 h-18 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                    <Camera className="w-9 h-9 text-primary" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 badge badge-primary font-mono text-xs font-bold shadow-sm">
                    {countdown}s
                  </span>
                </div>

                <div>
                  <h3
                    id="processing-modal-title"
                    className="text-xl font-bold text-base-content mb-1"
                  >
                    Processing Passport Photo
                  </h3>
                  <p className="text-xs text-base-content/65 font-mono">
                    Country: {selectedCountry.country_name} · Format:{" "}
                    {selectedCountry.dimensions} px
                  </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="w-full bg-base-200 rounded-full h-3 overflow-hidden border border-base-300/60">
                    <div
                      className="bg-primary h-3 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${processingProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs font-mono text-base-content/65 font-medium">
                    <span>{processingProgress}% Complete</span>
                    <span>{countdown}s remaining</span>
                  </div>
                </div>

                {/* Animated Steps */}
                <div className="bg-base-200/90 p-4 rounded-xl text-left space-y-2.5 border border-base-300 text-xs">
                  {PROCESSING_STEPS.map((step, idx) => {
                    const isDone = processingProgress >= step.progress;
                    const isCurrent = processingStepIndex === idx;

                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-2.5 transition-colors ${
                          isDone
                            ? "text-success font-medium"
                            : isCurrent
                            ? "text-primary font-bold"
                            : "text-base-content/45"
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle className="w-4 h-4 text-success shrink-0" />
                        ) : isCurrent ? (
                          <span className="loading loading-spinner loading-xs text-primary shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-base-300 shrink-0" />
                        )}
                        <span>{step.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
