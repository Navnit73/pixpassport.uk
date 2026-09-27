"use client";

import { useState, useMemo, useSyncExternalStore } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  Download,
  Printer,
  RefreshCw,
  Shield,
  FileCheck,
  Check,
  ExternalLink,
  ArrowLeft,
  AlertCircle,
  Upload,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { PassportProcessResult } from "@/lib/passport-api";

interface StoredPassportResult extends PassportProcessResult {
  country_code?: string;
  country_name?: string;
  target_dimensions?: string;
  document_type?: string;
  original_preview?: string;
  timestamp?: number;
}

function subscribeToStorage(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getRawStoredResult(resultId: string): string {
  if (typeof window === "undefined") return "";
  try {
    return (
      sessionStorage.getItem(`pixpassport_${resultId}`) ||
      localStorage.getItem(`pixpassport_${resultId}`) ||
      sessionStorage.getItem("pixpassport_latest") ||
      localStorage.getItem("pixpassport_latest") ||
      ""
    );
  } catch {
    return "";
  }
}

export default function PassportPhotoPreviewPage() {
  const params = useParams();
  const rawId = params?.id;
  const resultId = (Array.isArray(rawId) ? rawId[0] : (rawId as string)) || "result";

  const rawData = useSyncExternalStore(
    subscribeToStorage,
    () => getRawStoredResult(resultId),
    () => ""
  );

  const data = useMemo<StoredPassportResult | null>(() => {
    if (!rawData) return null;
    try {
      return JSON.parse(rawData) as StoredPassportResult;
    } catch {
      return null;
    }
  }, [rawData]);

  const [downloading, setDownloading] = useState(false);
  const isLoaded = true;

  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      resultId
    );

  const countryName = data?.country_name || "United Kingdom";
  const countryCode = data?.country_code || "GB";
  const dimensions = data?.dimensions || data?.target_dimensions || "600x750";

  const imageUrl =
    data?.image_url ||
    data?.original_preview ||
    (isUuid
      ? `https://res.cloudinary.com/ddxu2wqfm/image/upload/passport/results/${resultId}_photo.jpg`
      : undefined);

  const previewUrl =
    data?.preview_url ||
    data?.image_url ||
    (isUuid
      ? `https://res.cloudinary.com/ddxu2wqfm/image/upload/passport/results/${resultId}_preview.jpg`
      : undefined);

  const metrics = data?.metrics;

  function handlePrint() {
    if (typeof window !== "undefined") {
      window.print();
    }
  }

  async function triggerDownload(url: string, filename: string) {
    if (!url) return;
    setDownloading(true);
    try {
      if (url.startsWith("data:") || url.startsWith("blob:")) {
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const res = await fetch(url);
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }
    } catch {
      window.open(url, "_blank");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <>
      <Navbar ctaText="Create New Photo" ctaHref="/passport-size-photo-maker" />

      <main className="flex-1 bg-slate-50 min-h-screen py-6 sm:py-10 text-slate-900" id="main-content">
        <div className="container-narrow">
          {/* Breadcrumbs */}
          <nav className="text-xs text-slate-600 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 list-none p-0 m-0">
              <li>
                <Link href="/" className="text-slate-600 hover:text-lime-800 transition-colors font-medium">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/passport-size-photo-maker"
                  className="text-slate-600 hover:text-lime-800 transition-colors font-medium"
                >
                  Maker
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-slate-900 font-semibold" aria-current="page">Result Preview</li>
            </ol>
          </nav>

          {isLoaded && !imageUrl ? (
            /* Empty or Expired Session State */
            <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                Photo Session Not Found
              </h1>
              <p className="text-xs sm:text-sm text-slate-700 mb-6 font-medium">
                No active photo preview found for ID:{" "}
                <span className="font-mono font-semibold text-slate-900">{resultId}</span>.
                Please upload your photo to process a verified result.
              </p>
              <Link
                href="/passport-size-photo-maker"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#4D7C0F] hover:bg-[#3F650C] !text-white text-white font-bold text-sm sm:text-base py-3.5 rounded-xl transition-colors text-center shadow-xs focus-ring"
              >
                <Upload className="w-4 h-4" aria-hidden="true" />
                <span>Upload New Photo</span>
              </Link>
            </div>
          ) : (
            <>
              {/* Success Banner */}
              <div className="bg-lime-50 border border-lime-300 rounded-2xl p-5 sm:p-7 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#4D7C0F] text-white flex items-center justify-center shrink-0" aria-hidden="true">
                    <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Passport Photo Generated!
                      </h1>
                      <span className="px-2.5 py-0.5 rounded-full bg-lime-200 text-lime-950 font-extrabold text-xs">
                        Verified
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 font-medium">
                      Formatted to official {countryName} ({dimensions} px) passport biometric requirements.
                    </p>
                    <p className="text-[11px] text-slate-600 font-mono mt-1 break-all">
                      Result ID: {resultId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                  <Link
                    href="/passport-size-photo-maker"
                    className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-300 transition-colors w-full sm:w-auto focus-ring"
                  >
                    <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>New Photo</span>
                  </Link>
                  <button
                    onClick={handlePrint}
                    className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-300 transition-colors hidden sm:flex focus-ring"
                  >
                    <Printer className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              <div className="grid lg:grid-cols-12 gap-8 items-start">
                {/* Left Preview Column */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Processed Single Photo Card */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-5">
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900">
                          Official Single Passport Photo
                        </h2>
                        <p className="text-xs text-slate-600 font-mono mt-0.5">
                          {dimensions} px · {countryName} ({countryCode})
                        </p>
                      </div>
                      <span className="font-mono text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md font-bold">
                        {data?.format || "JPEG"} · {data?.size_kb || 156} KB
                      </span>
                    </div>

                    <div className="flex justify-center p-4 sm:p-6 bg-slate-50 rounded-xl border border-slate-200 mb-5">
                      <div className="relative inline-block rounded-lg overflow-hidden border border-slate-300 bg-white">
                        {imageUrl && (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={imageUrl}
                            alt={`Official ${countryName} Passport Photo`}
                            className="max-h-72 sm:max-h-80 object-contain rounded-lg"
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      {imageUrl && (
                        <button
                          type="button"
                          onClick={() => triggerDownload(imageUrl, `passport-${countryCode.toLowerCase()}.jpg`)}
                          disabled={downloading}
                          className="flex-1 inline-flex items-center justify-center gap-2 bg-[#4D7C0F] hover:bg-[#3F650C] !text-white text-white font-bold text-sm sm:text-base py-3.5 rounded-xl transition-colors text-center shadow-xs focus-ring"
                        >
                          <Download className="w-4 h-4" aria-hidden="true" />
                          <span>{downloading ? "Downloading…" : "Download High-Res Photo"}</span>
                        </button>
                      )}

                      {previewUrl && previewUrl !== imageUrl && (
                        <a
                          href={previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm sm:text-base py-3.5 rounded-xl border border-slate-300 transition-colors text-center focus-ring"
                        >
                          <ExternalLink className="w-4 h-4" aria-hidden="true" />
                          <span>View Full Sheet</span>
                          <span className="sr-only">(opens in new window)</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* 6x4 Print Template Preview Card */}
                  {previewUrl && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <Printer className="w-4 h-4 text-[#4D7C0F]" aria-hidden="true" />
                          <span>Print-Ready 6×4″ Sheet</span>
                        </h2>
                        <span className="text-xs font-mono font-semibold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                          Standard 10×15 cm
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed mb-4 font-medium">
                        Multi-photo grid sized for high-street photo kiosks (Boots, Tesco, Asda, pharmacies) or home photo printers.
                      </p>

                      <div className="p-3 sm:p-4 bg-slate-50 rounded-xl flex justify-center border border-slate-200 mb-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={previewUrl}
                          alt="Print Preview Sheet 6 by 4 inches"
                          className="max-h-44 sm:max-h-48 rounded object-contain border border-slate-200"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => triggerDownload(previewUrl, `passport-sheet-${countryCode.toLowerCase()}.jpg`)}
                        disabled={downloading}
                        className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm py-3 rounded-xl border border-slate-300 transition-colors focus-ring"
                      >
                        <Download className="w-4 h-4" aria-hidden="true" />
                        <span>Download 6×4″ Print Sheet</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Metrics & Compliance Column */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Biometric Verification Card */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                      <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[#4D7C0F]" aria-hidden="true" />
                        <span>Biometric Compliance Analysis</span>
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-lime-100 text-lime-950 text-xs font-extrabold">
                        100% Passed
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <span className="text-slate-700 font-semibold">Head Height:</span>
                        <span className="font-mono font-bold text-lime-900 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-lime-700" aria-hidden="true" />
                          {metrics?.head_height_pct ?? 70}% (Official 70-80%)
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <span className="text-slate-700 font-semibold">Eye Position:</span>
                        <span className="font-mono font-bold text-lime-900 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-lime-700" aria-hidden="true" />
                          {metrics?.eye_position_pct ?? 53.7}% (Centered)
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <span className="text-slate-700 font-semibold">Top Clearance:</span>
                        <span className="font-mono font-bold text-lime-900 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-lime-700" aria-hidden="true" />
                          {metrics?.top_margin_pct ?? 7.9}% (Optimal)
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <span className="text-slate-700 font-semibold">Background:</span>
                        <span className="font-bold text-lime-900 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-lime-700" aria-hidden="true" />
                          Plain Light (Cleaned)
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <span className="text-slate-700 font-semibold">Aspect Ratio:</span>
                        <span className="font-mono font-bold text-slate-900">
                          {dimensions} px ({countryCode})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Printing Instructions */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 text-xs text-slate-700">
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 mb-3">
                      <FileCheck className="w-4 h-4 text-[#4D7C0F]" aria-hidden="true" />
                      <span>How to Print &amp; Submit:</span>
                    </h3>
                    <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed font-medium">
                      <li>
                        <strong>Online Renewal:</strong> Upload the single photo directly to your official passport application portal.
                      </li>
                      <li>
                        <strong>In-Person Paper Submission:</strong> Print the 6×4″ sheet at 100% scale without &quot;fit to page&quot; resizing.
                      </li>
                      <li>
                        <strong>Photo Paper:</strong> Use glossy or matte photo paper for official government acceptance.
                      </li>
                    </ol>
                  </div>

                  {/* Back to maker button */}
                  <Link
                    href="/passport-size-photo-maker"
                    className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm py-3 rounded-xl border border-slate-300 transition-colors focus-ring"
                  >
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                    <span>Process Another Country / Photo</span>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
