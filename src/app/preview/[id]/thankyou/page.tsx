"use client";

import { useState, useMemo, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Download,
  Printer,
  FileText,
  Mail,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  ArrowLeft,
  Upload,
  Check,
  Clock,
  HelpCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { PassportProcessResult } from "@/lib/passport-api";
import { PRICING } from "@/lib/config/pricing";

interface StoredPassportResult extends PassportProcessResult {
  country_code?: string;
  country_name?: string;
  target_dimensions?: string;
  document_type?: string;
  original_preview?: string;
  timestamp?: number;
}

interface StoredPaymentInfo {
  paymentId: string;
  downloadToken?: string;
  invoiceNumber?: string;
  status: "paid" | "pending" | "failed";
  email: string;
  paidAt?: string;
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

function getStoredPayment(resultId: string): StoredPaymentInfo | null {
  if (typeof window === "undefined") return null;
  try {
    const raw =
      sessionStorage.getItem(`pixpassport_paid_${resultId}`) ||
      localStorage.getItem(`pixpassport_paid_${resultId}`);
    return raw ? (JSON.parse(raw) as StoredPaymentInfo) : null;
  } catch {
    return null;
  }
}

export default function ThankYouDownloadPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const rawId = params?.id;
  const resultId = (Array.isArray(rawId) ? rawId[0] : (rawId as string)) || "result";
  const queryPaymentId = searchParams.get("paymentId") || "";

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

  const [activeTab, setActiveTab] = useState<"single" | "sheet">("single");
  const [downloading, setDownloading] = useState(false);
  const [paymentState, setPaymentState] = useState<StoredPaymentInfo | null>(() => getStoredPayment(resultId));
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const countryName = data?.country_name || "United Kingdom";
  const countryCode = data?.country_code || "GB";
  const dimensions = data?.dimensions || data?.target_dimensions || "600x750";

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(resultId);

  const fullImageUrl =
    data?.image_url ||
    (isUuid
      ? `https://res.cloudinary.com/ddxu2wqfm/image/upload/passport/results/${resultId}_photo.jpg`
      : undefined);

  const previewUrl =
    data?.preview_url ||
    data?.image_url ||
    (isUuid
      ? `https://res.cloudinary.com/ddxu2wqfm/image/upload/passport/results/${resultId}_preview.jpg`
      : undefined);

  // If token is missing, fetch status from server
  useEffect(() => {
    const paymentIdToFetch = paymentState?.paymentId || queryPaymentId;
    if (paymentIdToFetch && (!paymentState?.downloadToken || paymentState.status !== "paid")) {
      setIsLoadingStatus(true);
      fetch(`/api/payments/status/${paymentIdToFetch}`)
        .then((res) => res.json())
        .then((resData) => {
          if (resData.success) {
            const updated: StoredPaymentInfo = {
              paymentId: resData.paymentId,
              downloadToken: resData.downloadToken,
              status: resData.status,
              email: paymentState?.email || "customer@pixpassport.uk",
              paidAt: resData.paidAt || new Date().toISOString(),
            };
            setPaymentState(updated);
            try {
              sessionStorage.setItem(`pixpassport_paid_${resultId}`, JSON.stringify(updated));
              localStorage.setItem(`pixpassport_paid_${resultId}`, JSON.stringify(updated));
            } catch {}
          }
        })
        .catch((err) => console.error("Failed to fetch payment status:", err))
        .finally(() => setIsLoadingStatus(false));
    }
  }, [queryPaymentId, paymentState?.paymentId, paymentState?.downloadToken, paymentState?.status, resultId]);

  /**
   * Draw 6x4" 300 DPI Print Sheet Canvas
   */
  const renderSheetCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const imgSource = fullImageUrl || previewUrl;
    if (!canvas || !imgSource) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Standard 6x4" at 300 DPI = 1800 x 1200 px (Landscape)
    const paperWidth = 1800;
    const paperHeight = 1200;
    canvas.width = paperWidth;
    canvas.height = paperHeight;

    // White background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, paperWidth, paperHeight);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imgSource;

    img.onload = () => {
      // Parse photo dimensions (default 35x45mm at 300 DPI ~ 413 x 531 px, or 2x2" ~ 600 x 600 px)
      let photoWidth = 413;
      let photoHeight = 531;

      if (dimensions.includes("x")) {
        const parts = dimensions.toLowerCase().replace("px", "").split("x").map(Number);
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          // Scale to 300 DPI standard print size
          if (parts[0] === parts[1]) {
            // Square (e.g. US 2x2") -> 600x600 px
            photoWidth = 600;
            photoHeight = 600;
          } else {
            // Standard UK 35x45mm -> 413x531 px
            photoWidth = 413;
            photoHeight = 531;
          }
        }
      }

      // Calculate grid (e.g., 2x3 grid for UK, 2x2 grid for US)
      const cols = photoWidth >= 550 ? 2 : 3;
      const rows = photoWidth >= 550 ? 2 : 2;

      const totalGridWidth = cols * photoWidth;
      const totalGridHeight = rows * photoHeight;

      const gapX = (paperWidth - totalGridWidth) / (cols + 1);
      const gapY = (paperHeight - totalGridHeight) / (rows + 1);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = gapX + c * (photoWidth + gapX);
          const y = gapY + r * (photoHeight + gapY);

          // Draw Photo
          ctx.drawImage(img, x, y, photoWidth, photoHeight);

          // Draw subtle cutting guideline
          ctx.strokeStyle = "#CBD5E1";
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, photoWidth, photoHeight);
        }
      }

      // Footer branding & cut guide
      ctx.fillStyle = "#94A3B8";
      ctx.font = "bold 24px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(
        `PixPassport — Official ${countryName} Passport Photo Template (Standard 6×4″ Photo Paper)`,
        paperWidth / 2,
        paperHeight - 20
      );
    };
  }, [fullImageUrl, previewUrl, countryName, dimensions]);

  useEffect(() => {
    renderSheetCanvas();
  }, [renderSheetCanvas]);

  /**
   * Handle Single Photo Download
   */
  const handleDownloadSingle = async () => {
    setDownloading(true);
    try {
      if (paymentState?.downloadToken) {
        const url = `/api/download/${paymentState.downloadToken}`;
        const a = document.createElement("a");
        a.href = url;
        a.download = `passport-photo-${countryCode.toLowerCase()}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }

      const targetUrl = fullImageUrl || previewUrl;
      if (!targetUrl) return;

      const res = await fetch(targetUrl);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `passport-photo-${countryCode.toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Single download error:", err);
      if (fullImageUrl) window.open(fullImageUrl, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  /**
   * Handle 6x4" Print Sheet Download
   */
  const handleDownloadSheet = async () => {
    setDownloading(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) {
        renderSheetCanvas();
      }
      const activeCanvas = canvasRef.current;
      if (activeCanvas) {
        const dataUrl = activeCanvas.toDataURL("image/jpeg", 0.98);
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `passport-sheet-6x4-${countryCode.toLowerCase()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error("Sheet download error:", err);
    } finally {
      setDownloading(false);
    }
  };

  const paymentId = paymentState?.paymentId || queryPaymentId;
  const userEmail = paymentState?.email || "your email";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar ctaText="Create Another Photo" ctaHref="/passport-size-photo-maker" />

      {/* Hidden Canvas for High-Resolution 6x4" Template Generation */}
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      <main className="flex-1 py-8 sm:py-12" id="main-content">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Top Success Banner */}
          <div className="bg-white border border-emerald-200 rounded-3xl p-6 sm:p-10 shadow-sm mb-8 text-center relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-emerald-100/60 blur-3xl -z-10 rounded-full" />

            <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-xs">
              <CheckCircle2 className="w-9 h-9 text-[#4D7C0F]" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#4D7C0F]" /> Payment Confirmed &bull; Instant Access Ready
            </span>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Thank You! Your Passport Photo is Ready
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-medium">
              Your biometric photo has been verified against official <strong>{countryName}</strong> government standards. You can download the single digital master and print-ready 6×4″ sheet below.
            </p>

            {/* Email Dispatch Callout */}
            <div className="mt-6 inline-flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs sm:text-sm text-slate-700 font-medium">
              <Mail className="w-4 h-4 text-[#4D7C0F] shrink-0" />
              <span>
                A copy with your <strong>Tax Invoice PDF</strong> has been emailed to:{" "}
                <strong className="text-slate-900">{userEmail}</strong>
              </span>
            </div>
          </div>

          {/* Main 2-Column Content Grid */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Visual Studio & Download Actions (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
                {/* Tab Switcher */}
                <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6">
                  <button
                    type="button"
                    onClick={() => setActiveTab("single")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      activeTab === "single"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    <span>Single Digital Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("sheet")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      activeTab === "sheet"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print-Ready 6×4″ Sheet</span>
                  </button>
                </div>

                {/* Preview Studio Canvas Area */}
                <div className="bg-slate-100/80 rounded-2xl p-6 flex flex-col items-center justify-center border border-slate-200/80 min-h-[360px]">
                  {activeTab === "single" ? (
                    <div className="text-center">
                      <div className="inline-block relative rounded-xl overflow-hidden shadow-md border-2 border-white bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={fullImageUrl || previewUrl}
                          alt={`${countryName} Verified Passport Photo`}
                          className="max-h-72 sm:max-h-84 object-contain rounded-lg"
                        />
                        <div className="absolute top-2 right-2 bg-[#4D7C0F] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                          300 DPI &bull; ICAO Compliant
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-3">
                        {countryName} Official Size: {dimensions}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center w-full">
                      <div className="inline-block relative rounded-xl overflow-hidden shadow-md border-2 border-white bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={previewUrl || fullImageUrl}
                          alt={`${countryName} 6x4 Print Template`}
                          className="max-h-72 sm:max-h-84 object-contain rounded-lg"
                        />
                        <div className="absolute top-2 right-2 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                          Standard 10×15 cm (6×4″)
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-3">
                        Ready to print at Boots, Tesco, pharmacies, or at home.
                      </p>
                    </div>
                  )}
                </div>

                {/* Primary Download Action Buttons */}
                <div className="mt-6 space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleDownloadSingle}
                      disabled={downloading}
                      className="inline-flex items-center justify-center gap-2 bg-[#4D7C0F] hover:bg-[#3F650C] !text-white text-white font-bold text-sm py-4 rounded-xl transition-all shadow-xs focus-ring"
                    >
                      <Download className="w-5 h-5" />
                      <span>{downloading ? "Preparing Download…" : "Download Single Photo"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadSheet}
                      disabled={downloading}
                      className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-4 rounded-xl transition-all shadow-xs focus-ring"
                    >
                      <Printer className="w-5 h-5" />
                      <span>Download 6×4″ Print Sheet</span>
                    </button>
                  </div>

                  {paymentId && (
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <a
                        href={`/api/invoices/${paymentId}?format=pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-slate-700 hover:text-slate-900 font-bold bg-slate-100 hover:bg-slate-200 px-3.5 py-2.5 rounded-lg transition-colors"
                      >
                        <FileText className="w-4 h-4 text-[#4D7C0F]" />
                        <span>Download Tax Invoice (PDF)</span>
                      </a>

                      <a
                        href={`/api/invoices/${paymentId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 font-medium transition-colors"
                      >
                        <span>View Web Invoice</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Printing Step-by-Step Guide */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                  <Printer className="w-5 h-5 text-[#4D7C0F]" />
                  <span>How to Print at Kiosks (Save £10–£15)</span>
                </h2>

                <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                    <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#4D7C0F] text-white flex items-center justify-center text-[11px]">1</span>
                      <span>Save 6×4″ Sheet</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-xs">
                      Download the 6×4″ template sheet to your smartphone or USB memory stick.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                    <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#4D7C0F] text-white flex items-center justify-center text-[11px]">2</span>
                      <span>Visit Any Kiosk</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-xs">
                      Go to Boots, Tesco, Asda, Snappy Snaps, CVS, or Walgreens photo counters.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                    <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#4D7C0F] text-white flex items-center justify-center text-[11px]">3</span>
                      <span>Select Standard 4×6″</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-xs">
                      Choose <strong>Standard 4×6″ (10×15 cm) Photo Print</strong> (costs ~15p–25p). Do NOT choose the passport option!
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                    <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#4D7C0F] text-white flex items-center justify-center text-[11px]">4</span>
                      <span>Cut &amp; Submit</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-xs">
                      Cut neatly along the guide lines for exact ICAO/HMPO government compliance.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Details, Guarantee & Support (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Order Receipt Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#4D7C0F]" />
                    <span className="font-bold text-slate-900 text-sm">Official Order Receipt</span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                    VERIFIED
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Product</span>
                    <span className="font-semibold text-slate-900 text-right">{PRICING.productName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Country</span>
                    <span className="font-semibold text-slate-900">{countryName} ({countryCode})</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Resolution &amp; Specs</span>
                    <span className="font-semibold text-slate-900 font-mono">{dimensions} px (300 DPI)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Delivery Email</span>
                    <span className="font-semibold text-slate-900">{userEmail}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Payment ID</span>
                    <span className="font-mono text-slate-900 font-semibold text-[11px]">{paymentId || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Amount Paid</span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      {PRICING.currencySymbol}{PRICING.amount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Expiry Note */}
                <div className="mt-5 bg-slate-50 rounded-xl p-3 text-[11px] text-slate-500 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Download link remains securely active for <strong>72 hours</strong>.</span>
                </div>
              </div>

              {/* 100% Government Acceptance Guarantee */}
              <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-7 shadow-xs">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-800/80 flex items-center justify-center text-emerald-300">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-extrabold text-white">100% Acceptance Guarantee</h3>
                </div>
                <p className="text-xs text-emerald-200/90 leading-relaxed mb-4">
                  We guarantee that your photo strictly adheres to HMPO, ICAO, and international biometric passport standards. If your photo is rejected for any technical reason, we will provide a free re-process or a 100% full refund.
                </p>
                <div className="pt-3 border-t border-emerald-900 flex items-center justify-between text-xs">
                  <Link href="/refund-policy" className="text-emerald-300 hover:text-white underline font-semibold transition-colors">
                    Refund Policy
                  </Link>
                  <Link href="/contact-us" className="text-emerald-300 hover:text-white underline font-semibold transition-colors">
                    Contact Support
                  </Link>
                </div>
              </div>

              {/* Create Another Photo Button */}
              <div className="pt-2">
                <Link
                  href="/passport-size-photo-maker"
                  className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm py-3.5 rounded-2xl transition-all shadow-xs text-center"
                >
                  <Upload className="w-4 h-4" />
                  <span>Create Photo for Another Person</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
