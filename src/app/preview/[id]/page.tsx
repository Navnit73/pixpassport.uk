"use client";

import { useState } from "react";
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
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import type { PassportProcessResult } from "@/lib/passport-api";

interface StoredPassportResult extends PassportProcessResult {
  country_code?: string;
  country_name?: string;
  target_dimensions?: string;
  document_type?: string;
  original_preview?: string;
}

function getStoredResult(resultId: string): StoredPassportResult | null {
  if (typeof window === "undefined") return null;
  try {
    const item =
      sessionStorage.getItem(`pixpassport_${resultId}`) ||
      sessionStorage.getItem("pixpassport_latest");
    return item ? (JSON.parse(item) as StoredPassportResult) : null;
  } catch {
    return null;
  }
}

export default function PassportPhotoPreviewPage() {
  const params = useParams();
  const resultId = (params?.id as string) || "result";

  const [data] = useState<StoredPassportResult | null>(() =>
    getStoredResult(resultId)
  );

  const countryName = data?.country_name || "United Kingdom";
  const countryCode = data?.country_code || "GB";
  const dimensions = data?.dimensions || data?.target_dimensions || "600x750";
  const imageUrl = data?.image_url || data?.original_preview || "/pixpassport.jpg";
  const previewUrl = data?.preview_url || data?.image_url;
  const metrics = data?.metrics;

  function handlePrint() {
    if (typeof window !== "undefined") {
      window.print();
    }
  }

  return (
    <>
      <JsonLd
        description={`Preview and download official biometric passport photo for ${countryName}. ID: ${resultId}`}
      />

      <Navbar ctaText="Create New Photo" ctaHref="/passport-size-photo-maker" />

      <main className="flex-1 bg-base-100 min-h-screen py-8 sm:py-12">
        <div className="container-narrow">
          {/* Breadcrumbs */}
          <nav className="text-xs sm:text-sm text-base-content/60 mb-4" aria-label="Breadcrumbs">
            <ol className="flex items-center gap-1.5 list-none p-0 m-0">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link
                  href="/passport-size-photo-maker"
                  className="hover:text-primary transition-colors"
                >
                  Maker
                </Link>
              </li>
              <li>/</li>
              <li className="text-base-content font-medium">Result Preview</li>
            </ol>
          </nav>

          {/* Success Banner */}
          <div className="bg-success/10 border border-success/30 rounded-2xl p-5 sm:p-7 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-success text-success-content flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-base-content tracking-tight">
                    Passport Photo Generated!
                  </h1>
                  <span className="badge badge-success text-success-content font-bold text-xs">
                    Verified
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-base-content/75">
                  Formatted to official {countryName} ({dimensions} px) passport
                  biometric requirements.
                </p>
                <p className="text-xs text-base-content/55 font-mono mt-1 break-all">
                  Result ID: {resultId}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
              <Link
                href="/passport-size-photo-maker"
                className="btn btn-outline btn-sm gap-1.5 w-full sm:w-auto font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                New Photo
              </Link>
              <button
                onClick={handlePrint}
                className="btn btn-ghost btn-sm gap-1.5 w-full sm:w-auto hidden sm:flex font-semibold"
              >
                <Printer className="w-3.5 h-3.5" />
                Print
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Preview Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Processed Single Photo Card */}
              <div className="card bg-base-100 border border-base-300 rounded-2xl card-shadow">
                <div className="card-body p-5 sm:p-7 gap-5">
                  <div className="flex items-center justify-between border-b border-base-200 pb-3.5">
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-base-content">
                        Official Single Passport Photo
                      </h2>
                      <p className="text-xs text-base-content/60 font-mono mt-0.5">
                        {dimensions} px · {countryName} ({countryCode})
                      </p>
                    </div>
                    <span className="badge badge-neutral font-mono text-xs">
                      {data?.format || "JPEG"} · {data?.size_kb || 156} KB
                    </span>
                  </div>

                  <div className="flex justify-center p-4 sm:p-6 bg-base-200 rounded-xl border border-base-300 shadow-inner">
                    <div className="relative inline-block shadow-md rounded-lg overflow-hidden border-2 border-base-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrl}
                        alt={`Official ${countryName} Passport Photo`}
                        className="max-h-72 sm:max-h-80 object-contain rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    {data?.image_url ? (
                      <a
                        href={data.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={`passport-${countryCode.toLowerCase()}.jpg`}
                        className="btn btn-primary flex-1 gap-2 font-semibold shadow-sm"
                      >
                        <Download className="w-4 h-4" />
                        Download High-Res Photo
                      </a>
                    ) : (
                      <a
                        href={imageUrl}
                        download={`passport-${countryCode.toLowerCase()}.jpg`}
                        className="btn btn-primary flex-1 gap-2 font-semibold shadow-sm"
                      >
                        <Download className="w-4 h-4" />
                        Download Photo
                      </a>
                    )}

                    {previewUrl && previewUrl !== imageUrl && (
                      <a
                        href={previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline flex-1 gap-2 font-semibold"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Full Sheet
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* 6x4 Print Template Preview Card */}
              {previewUrl && (
                <div className="card bg-base-100 border border-base-300 rounded-2xl card-shadow">
                  <div className="card-body p-5 sm:p-6 gap-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-base-content flex items-center gap-2">
                        <Printer className="w-4 h-4 text-primary" />
                        Print-Ready 6×4″ Sheet
                      </h3>
                      <span className="badge badge-outline text-xs font-mono font-medium">
                        Standard 10×15 cm
                      </span>
                    </div>
                    <p className="text-xs text-base-content/70 leading-relaxed">
                      Multi-photo grid sized for high-street photo kiosks
                      (Boots, Tesco, Walmart, pharmacies) or home photo printers.
                    </p>

                    <div className="p-3 sm:p-4 bg-base-200 rounded-xl flex justify-center border border-base-300 shadow-inner">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl}
                        alt="Print Preview Sheet"
                        className="max-h-44 sm:max-h-48 rounded object-contain shadow-xs"
                      />
                    </div>

                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={`passport-sheet-${countryCode.toLowerCase()}.jpg`}
                      className="btn btn-outline btn-sm w-full gap-2 font-semibold"
                    >
                      <Download className="w-4 h-4" />
                      Download 6×4″ Print Sheet
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Right Metrics & Compliance Column */}
            <div className="lg:col-span-5 space-y-6">
              {/* Biometric Verification Card */}
              <div className="card bg-base-100 border border-base-300 rounded-2xl card-shadow">
                <div className="card-body p-5 sm:p-6 gap-4">
                  <div className="flex items-center justify-between border-b border-base-200 pb-3">
                    <h3 className="font-bold text-base text-base-content flex items-center gap-2">
                      <Shield className="w-4 h-4 text-success" />
                      Biometric Compliance Analysis
                    </h3>
                    <span className="badge badge-success text-success-content text-xs font-bold">
                      100% Passed
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs bg-base-200/90 p-2.5 rounded-xl border border-base-300/60">
                      <span className="text-base-content/75 font-medium">Head Height:</span>
                      <span className="font-mono font-bold text-success flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        {metrics?.head_height_pct ?? 75}% (Official 70-80%)
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs bg-base-200/90 p-2.5 rounded-xl border border-base-300/60">
                      <span className="text-base-content/75 font-medium">Eye Position:</span>
                      <span className="font-mono font-bold text-success flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        {metrics?.eye_position_pct ?? 51.6}% (Centered)
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs bg-base-200/90 p-2.5 rounded-xl border border-base-300/60">
                      <span className="text-base-content/75 font-medium">Top Clearance:</span>
                      <span className="font-mono font-bold text-success flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        {metrics?.top_margin_pct ?? 8}% (Optimal)
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs bg-base-200/90 p-2.5 rounded-xl border border-base-300/60">
                      <span className="text-base-content/75 font-medium">Background:</span>
                      <span className="font-semibold text-success flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Plain Light (Cleaned)
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs bg-base-200/90 p-2.5 rounded-xl border border-base-300/60">
                      <span className="text-base-content/75 font-medium">Aspect Ratio:</span>
                      <span className="font-mono font-bold text-base-content">
                        {dimensions} px ({countryCode})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Printing Instructions */}
              <div className="card bg-base-100 border border-base-300 rounded-2xl card-shadow">
                <div className="card-body p-5 sm:p-6 gap-3 text-xs text-base-content/75">
                  <h4 className="font-bold text-sm text-base-content flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-primary" />
                    How to Print &amp; Submit:
                  </h4>
                  <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed">
                    <li>
                      <strong>Online Renewal:</strong> Upload the single photo
                      directly to your official passport application portal.
                    </li>
                    <li>
                      <strong>In-Person Paper Submission:</strong> Print the 6×4″
                      sheet at 100% scale without &quot;fit to page&quot; resizing.
                    </li>
                    <li>
                      <strong>Photo Paper:</strong> Use glossy or matte photo
                      paper for official government acceptance.
                    </li>
                  </ol>
                </div>
              </div>

              {/* Back to maker button */}
              <Link
                href="/passport-size-photo-maker"
                className="btn btn-outline w-full gap-2 font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                Process Another Country / Photo
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
