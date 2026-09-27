"use client";

import {
  useState,
  useRef,
  useEffect,
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
  Camera,
  Check,
  RotateCcw,
  Search,
  ChevronDown,
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
  { text: "Analyzing facial landmarks & eye alignment…", progress: 25 },
  { text: "Removing shadows & verifying background…", progress: 50 },
  { text: "Cropping to exact government dimensions…", progress: 75 },
  { text: "Finalizing digital photo & 6×4″ print sheet…", progress: 95 },
];

// Converts a 2-letter ISO country code into its flag emoji (e.g. "GB" -> 🇬🇧)
function countryFlag(code: string): string {
  if (!code || code.length !== 2) return "🌍";
  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

export default function PassportSizePhotoMakerPage() {
  const router = useRouter();

  // Country selection (Default: United Kingdom)
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("GB");
  const selectedCountry: CountryPassportConfig =
    getCountryByCode(selectedCountryCode) || DEFAULT_COUNTRY;

  // Searchable country dropdown state
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countryQuery, setCountryQuery] = useState("");
  const countryBoxRef = useRef<HTMLDivElement>(null);
  const countrySearchRef = useRef<HTMLInputElement>(null);

  const filteredCountries = COUNTRIES.filter((c) => {
    const q = countryQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      c.country_name.toLowerCase().includes(q) ||
      c.country_code.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        countryBoxRef.current &&
        !countryBoxRef.current.contains(e.target as Node)
      ) {
        setIsCountryOpen(false);
        setCountryQuery("");
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsCountryOpen(false);
        setCountryQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function openCountryDropdown() {
    if (isProcessing) return;
    setIsCountryOpen(true);
    // focus the search box once it mounts
    requestAnimationFrame(() => countrySearchRef.current?.focus());
  }

  function selectCountry(code: string) {
    setSelectedCountryCode(code);
    setIsCountryOpen(false);
    setCountryQuery("");
  }

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
  const processBtnRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to process CTA button upon successful photo upload
  useEffect(() => {
    if (preview && file && !isProcessing) {
      const timer = setTimeout(() => {
        processBtnRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [preview, file, isProcessing]);

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
    setFile(f);

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
        price="7.99"
        priceCurrency="GBP"
        description={`Create official biometric passport size photos for ${selectedCountry.country_name} (${selectedCountry.dimensions} px) for £7.99 with instant verification.`}
      />

      <Navbar ctaText="Home" ctaHref="/" />

      <main className="flex-1 bg-slate-50 min-h-screen py-6 sm:py-12 text-slate-900" id="studio">
        <div className="container-narrow max-w-2xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb & Header */}
          <div className="text-center mb-5 sm:mb-7">
            <nav className="text-xs text-slate-500 mb-2 flex justify-center" aria-label="Breadcrumbs">
              <ol className="flex items-center gap-1.5 list-none p-0 m-0">
                <li>
                  <Link href="/" className="hover:text-lime-700 transition-colors">
                    Home
                  </Link>
                </li>
                <li>/</li>
                <li className="text-slate-800 font-medium">
                  Passport Size Photo Maker
                </li>
              </ol>
            </nav>

            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Passport Photo Maker
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1.5 max-w-md mx-auto">
              Select your country, upload your photo, and let AI automatically size and verify biometrics in 10 seconds.
            </p>
          </div>

          {/* Error Alert (shared, sits above both cards) */}
          {error && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-xl p-3.5 sm:p-4 text-sm flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
              <button
                className="text-red-500 hover:text-red-700 p-1"
                onClick={() => setError(null)}
                aria-label="Dismiss error"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="space-y-4 sm:space-y-5">
            {/* CARD 1 — Country Selector (small, separate card) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
              <label
                htmlFor="country-search-trigger"
                className="block text-xs sm:text-sm font-bold text-slate-800 mb-2"
              >
                Select Country / Destination
              </label>

              <div className="relative" ref={countryBoxRef}>
                <button
                  id="country-search-trigger"
                  type="button"
                  disabled={isProcessing}
                  onClick={() =>
                    isCountryOpen ? setIsCountryOpen(false) : openCountryDropdown()
                  }
                  className="w-full flex items-center justify-between gap-2 text-slate-900 font-medium bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-lime-600 focus:ring-1 focus:ring-lime-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  aria-haspopup="listbox"
                  aria-expanded={isCountryOpen}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="text-lg leading-none shrink-0">
                      {countryFlag(selectedCountry.country_code)}
                    </span>
                    <span className="truncate">
                      {selectedCountry.country_name} ({selectedCountry.country_code}) —{" "}
                      {selectedCountry.dimensions} px
                    </span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      isCountryOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isCountryOpen && (
                  <div
                    className="absolute z-30 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden flex flex-col"
                    role="listbox"
                  >
                    <div className="p-2 border-b border-slate-100 bg-white shrink-0">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          ref={countrySearchRef}
                          type="text"
                          value={countryQuery}
                          onChange={(e) => setCountryQuery(e.target.value)}
                          placeholder="Search country…"
                          className="w-full pl-9 pr-3 py-2.5 text-sm text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:border-lime-600 focus:ring-1 focus:ring-lime-600"
                          aria-label="Search countries"
                        />
                      </div>
                    </div>

                    <ul className="max-h-56 sm:max-h-72 overflow-y-auto py-1">
                      {filteredCountries.length === 0 && (
                        <li className="px-4 py-4 text-sm text-slate-500 text-center">
                          No countries match &ldquo;{countryQuery}&rdquo;
                        </li>
                      )}
                      {filteredCountries.map((c) => {
                        const active = c.country_code === selectedCountryCode;
                        return (
                          <li key={c.country_code}>
                            <button
                              type="button"
                              role="option"
                              aria-selected={active}
                              onClick={() => selectCountry(c.country_code)}
                              className={`w-full flex items-center justify-between gap-2 text-left px-4 py-2.5 text-sm transition-colors ${
                                active
                                  ? "bg-lime-50 text-lime-800 font-semibold"
                                  : "text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              <span className="flex items-center gap-2 min-w-0">
                                <span className="text-base leading-none shrink-0">
                                  {countryFlag(c.country_code)}
                                </span>
                                <span className="truncate">{c.country_name}</span>
                              </span>
                              <span className="flex items-center gap-2 shrink-0">
                                <span className="font-mono text-xs text-slate-400">
                                  {c.dimensions}px
                                </span>
                                {active && (
                                  <Check className="w-4 h-4 text-lime-600" />
                                )}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>

              <p className="text-slate-400 text-xs mt-2 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                {selectedCountry.document_type
                  ? `${selectedCountry.document_type.charAt(0).toUpperCase()}${selectedCountry.document_type.slice(1)} photo`
                  : "Passport photo"}{" "}
                sized to {selectedCountry.dimensions} px for {selectedCountry.country_name}
              </p>
            </div>

            {/* CARD 2 — Upload (separate card) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-2">
                  Upload or Take Your Photo
                </label>

                {!preview ? (
                  <div
                    className={`border-2 border-dashed rounded-2xl p-5 sm:p-10 text-center cursor-pointer transition-all ${
                      isDragging
                        ? "border-lime-600 bg-lime-50/50"
                        : "border-slate-300 hover:border-lime-500 bg-slate-50/60 hover:bg-slate-50"
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
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto mb-3 text-slate-400">
                      <ImagePlus className="w-6 h-6 sm:w-7 sm:h-7 text-lime-700" />
                    </div>

                    <p className="text-slate-900 font-bold text-sm sm:text-lg mb-1">
                      Tap to upload photo or take picture
                    </p>
                    <p className="text-slate-500 text-xs sm:text-sm mb-4">
                      Drag &amp; drop from your device · JPEG, PNG, or WebP (up to 20 MB)
                    </p>

                  
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Photo Preview Card */}
                    <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center">
                      <div className="relative max-h-64 sm:max-h-80 w-auto rounded-xl overflow-hidden border border-slate-300">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={preview}
                          alt="Uploaded passport photo preview"
                          className="max-h-64 sm:max-h-80 w-auto object-contain rounded-xl"
                        />
                      </div>

                      {!isProcessing && (
                        <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
                          <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-lg border border-slate-300 transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Change Photo
                          </button>
                          <button
                            type="button"
                            onClick={clearFile}
                            className="inline-flex items-center gap-1.5 bg-white hover:bg-red-50 text-red-700 font-semibold text-xs px-3.5 py-2 rounded-lg border border-red-200 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
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

              {/* Action CTA Button */}
              {file && !isProcessing && (
                <div ref={processBtnRef} className="pt-5 sm:pt-6 border-t border-slate-100 mt-5 sm:mt-6">
                  <button
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#4D7C0F] hover:bg-[#3F650C] !text-white text-white font-bold text-sm sm:text-base py-3.5 sm:py-4 rounded-xl transition-colors text-center"
                    onClick={handleProcess}
                  >
                    <Zap className="w-5 h-5 text-lime-300 shrink-0" />
                    <span className="truncate">
                      Process for {selectedCountry.country_name}
                    </span>
                    <ArrowRight className="w-4 h-4 ml-1 shrink-0" />
                  </button>
                  <p className="text-center text-xs text-slate-500 mt-2.5">
                    ⚡ 10-second biometric crop &amp; verify · Single digital file + 6×4″ printable sheet
                  </p>
                </div>
              )}

              {/* Photo Guidelines Checklist */}
              <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-slate-100 text-xs text-slate-600">
                <p className="font-bold text-slate-800 mb-2">
                  Quick Acceptance Tips:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-lime-600 shrink-0" />
                    <span>Look straight into camera, neutral face</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-lime-600 shrink-0" />
                    <span>Eyes open, mouth closed, no red-eye</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-lime-600 shrink-0" />
                    <span>Even lighting on face &amp; shoulders</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-lime-600 shrink-0" />
                    <span>Plain background (our AI will auto-clean)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 10-SECOND PROCESSING MODAL OVERLAY (mobile-safe, scrolls if needed) */}
        {isProcessing && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="processing-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-fade-in"
          >
            <div className="bg-white border border-slate-200 max-w-md w-full max-h-[90vh] overflow-y-auto rounded-2xl p-5 sm:p-8 text-center">
              {/* Countdown circle */}
              <div className="relative mx-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-lime-50 border border-lime-200 flex items-center justify-center mb-4">
                <Camera className="w-7 h-7 sm:w-8 sm:h-8 text-[#4D7C0F]" />
                <span className="absolute -bottom-1 -right-1 font-mono text-xs font-extrabold bg-[#4D7C0F] text-white px-1.5 py-0.5 rounded-full">
                  {countdown}s
                </span>
              </div>

              <h3
                id="processing-modal-title"
                className="text-base sm:text-xl font-bold text-slate-900 mb-1"
              >
                Processing Passport Photo
              </h3>
              <p className="text-xs text-slate-500 font-mono mb-5">
                {selectedCountry.country_name} · Format: {selectedCountry.dimensions} px
              </p>

              {/* Progress Bar */}
              <div className="space-y-2 mb-6">
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                  <div
                    className="bg-[#4D7C0F] h-2.5 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${processingProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs font-mono text-slate-500 font-medium">
                  <span>{processingProgress}% Complete</span>
                  <span>{countdown}s remaining</span>
                </div>
              </div>

              {/* Animated Progress Steps */}
              <div className="bg-slate-50 p-4 rounded-xl text-left space-y-2.5 border border-slate-200 text-xs">
                {PROCESSING_STEPS.map((step, idx) => {
                  const isDone = processingProgress >= step.progress;
                  const isCurrent = processingStepIndex === idx;

                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-2.5 transition-colors ${
                        isDone
                          ? "text-lime-800 font-medium"
                          : isCurrent
                          ? "text-[#4D7C0F] font-bold"
                          : "text-slate-400"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle className="w-4 h-4 text-[#4D7C0F] shrink-0" />
                      ) : isCurrent ? (
                        <span className="w-4 h-4 rounded-full border-2 border-[#4D7C0F] border-t-transparent animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                      )}
                      <span>{step.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}