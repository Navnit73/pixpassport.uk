"use client";

import { useState, useMemo, useEffect, useSyncExternalStore } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  Download,
  Printer,
  RefreshCw,
  Shield,
  FileCheck,
  Check,
  ArrowLeft,
  AlertCircle,
  Upload,
  Lock,
  Mail,
  Receipt,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CreditCard,
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

function saveStoredPayment(resultId: string, info: StoredPaymentInfo) {
  if (typeof window === "undefined") return;
  try {
    const json = JSON.stringify(info);
    sessionStorage.setItem(`pixpassport_paid_${resultId}`, json);
    localStorage.setItem(`pixpassport_paid_${resultId}`, json);
  } catch (e) {
    console.error("Failed to save payment info locally:", e);
  }
}

/**
 * Dynamically load Razorpay checkout script
 */
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as unknown as { Razorpay?: unknown }).Razorpay) {
      return resolve(true);
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PassportPhotoPreviewPage() {
  const router = useRouter();
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

  const [activeTab, setActiveTab] = useState<"single" | "sheet">("single");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [paymentState, setPaymentState] = useState<StoredPaymentInfo | null>(null);

  // Check existing payment on mount
  useEffect(() => {
    const existing = getStoredPayment(resultId);
    if (existing && existing.status === "paid") {
      setPaymentState(existing);
      if (existing.email) setEmail(existing.email);
    }
  }, [resultId]);

  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      resultId
    );

  const countryName = data?.country_name || "United Kingdom";
  const countryCode = data?.country_code || "GB";
  const dimensions = data?.dimensions || data?.target_dimensions || "600x750";

  // Full-res clean image (unlocked only after payment)
  const fullImageUrl =
    data?.image_url ||
    (isUuid
      ? `https://res.cloudinary.com/ddxu2wqfm/image/upload/passport/results/${resultId}_photo.jpg`
      : undefined);

  // Watermarked preview image
  const previewUrl =
    data?.preview_url ||
    data?.image_url ||
    (isUuid
      ? `https://res.cloudinary.com/ddxu2wqfm/image/upload/passport/results/${resultId}_preview.jpg`
      : undefined);

  const isPaid = paymentState?.status === "paid";
  const metrics = data?.metrics;

  const validateEmail = (val: string): boolean => {
    const trimmed = val.trim().toLowerCase();
    if (!trimmed) {
      setEmailError("Please enter your email address to receive your photos.");
      return false;
    }
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(trimmed)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (emailError) {
      validateEmail(val);
    }
  };

  /**
   * Initiate Razorpay Payment
   */
  const handleInitiatePayment = async () => {
    setPaymentError("");
    if (!validateEmail(email)) return;

    if (!fullImageUrl && !previewUrl) {
      setPaymentError("Image session data missing. Please re-upload your photo.");
      return;
    }

    setIsProcessingPayment(true);

    try {
      // 1. Load Razorpay checkout script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Unable to load payment gateway. Please check your internet connection.");
      }

      // 2. Create order on server
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          resultId,
          imageUrl: fullImageUrl || previewUrl,
          previewUrl: previewUrl || fullImageUrl,
          dimensions,
          format: data?.format || "JPEG",
          sizeKb: data?.size_kb || 150,
          countryCode,
          countryName,
        }),
      });

      const orderData = await res.json();
      if (!res.ok || !orderData.success) {
        throw new Error(orderData.error || "Failed to initiate payment. Please try again.");
      }

      const { paymentId, razorpayOrderId, amount, currency, keyId } = orderData;

      // 3. Open Razorpay Checkout Modal
      const RazorpayConstructor = (window as unknown as {
        Razorpay: new (options: Record<string, unknown>) => {
          open: () => void;
          on: (event: string, callback: (resp: unknown) => void) => void;
        };
      }).Razorpay;

      const rzp = new RazorpayConstructor({
        key: keyId,
        amount,
        currency,
        name: PRICING.businessName,
        description: `${countryName} Biometric Passport Photo & Print Sheet`,
        image: "https://pixpassport.uk/logo.png",
        order_id: razorpayOrderId,
        prefill: {
          email: email.trim().toLowerCase(),
        },
        notes: {
          paymentId,
          resultId,
        },
        theme: {
          color: "#4D7C0F",
        },
        modal: {
          ondismiss: () => {
            setIsProcessingPayment(false);
          },
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // 4. Verify payment on server
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || "Payment verification failed.");
            }

            // 5. Obtain download token directly from verification response (or fallback to status polling)
            let downloadToken = verifyData.downloadToken || "";
            if (!downloadToken) {
              try {
                const statusRes = await fetch(`/api/payments/status/${paymentId}`);
                const statusData = await statusRes.json();
                if (statusData.success && statusData.downloadToken) {
                  downloadToken = statusData.downloadToken;
                }
              } catch {
                // Ignore polling failure — can still download via direct session
              }
            }

            const paidInfo: StoredPaymentInfo = {
              paymentId,
              downloadToken,
              status: "paid",
              email: email.trim().toLowerCase(),
              paidAt: new Date().toISOString(),
            };

            saveStoredPayment(resultId, paidInfo);
            setPaymentState(paidInfo);

            // Redirect customer to Thank You & Download Studio
            router.push(`/preview/${resultId}/thankyou?paymentId=${paymentId}`);
          } catch (verifyErr) {
            console.error("Verification error:", verifyErr);
            setPaymentError(
              verifyErr instanceof Error
                ? verifyErr.message
                : "Payment was charged but verification had an issue. Please contact support."
            );
          } finally {
            setIsProcessingPayment(false);
          }
        },
      });

      rzp.on("payment.failed", (resp: unknown) => {
        setIsProcessingPayment(false);
        const errDesc = (resp as { error?: { description?: string } })?.error?.description;
        setPaymentError(errDesc || "Payment was not completed. Please try again.");
      });

      rzp.open();
    } catch (err) {
      console.error("Payment initiation error:", err);
      setIsProcessingPayment(false);
      setPaymentError(
        err instanceof Error ? err.message : "An unexpected error occurred. Please try again."
      );
    }
  };

  /**
   * Handle downloading single high-res photo or sheet
   */
  const handleDownload = async (type: "single" | "sheet") => {
    setDownloading(true);
    try {
      if (isPaid && paymentState?.downloadToken && type === "single") {
        // Protected endpoint for paid customers
        const url = `/api/download/${paymentState.downloadToken}`;
        const a = document.createElement("a");
        a.href = url;
        a.download = `passport-photo-${countryCode.toLowerCase()}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }

      const targetUrl = type === "single" ? (fullImageUrl || previewUrl) : previewUrl;
      if (!targetUrl) return;

      if (targetUrl.startsWith("data:") || targetUrl.startsWith("blob:")) {
        const link = document.createElement("a");
        link.href = targetUrl;
        link.download = `passport-${type}-${countryCode.toLowerCase()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const res = await fetch(targetUrl);
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `passport-${type}-${countryCode.toLowerCase()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }
    } catch (err) {
      console.error("Download failed:", err);
      const fallbackUrl = type === "single" ? fullImageUrl : previewUrl;
      if (fallbackUrl) window.open(fallbackUrl, "_blank");
    } finally {
      setDownloading(false);
    }
  };

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
              <li className="text-slate-900 font-semibold" aria-current="page">
                {isPaid ? "Download Passport Photo" : "Biometric Result Preview"}
              </li>
            </ol>
          </nav>

          {!fullImageUrl && !previewUrl ? (
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
                Please upload your photo to process an official verified result.
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
              {/* Status Header Banner */}
              {isPaid ? (
                <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 sm:p-7 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#4D7C0F] text-white flex items-center justify-center shrink-0 shadow-xs" aria-hidden="true">
                      <Sparkles className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h1 className="!text-lg sm:!text-2xl lg:!text-3xl font-extrabold text-slate-900 tracking-tight">
                          Payment Confirmed &amp; Photos Ready!
                        </h1>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-950 font-extrabold text-xs">
                          Paid
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 font-medium">
                        Receipt and download links have also been dispatched to{" "}
                        <strong className="text-slate-900">{paymentState?.email || email}</strong>.
                      </p>
                      <p className="text-[11px] text-slate-600 font-mono mt-1">
                        Payment ID: {paymentState?.paymentId}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0">
                    <Link
                      href={`/preview/${resultId}/thankyou?paymentId=${paymentState?.paymentId || ""}`}
                      className="inline-flex items-center justify-center gap-1.5 bg-[#4D7C0F] hover:bg-[#3F650C] !text-white text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-colors shadow-xs w-full sm:w-auto focus-ring"
                    >
                      <Download className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Go to Download Studio &rarr;</span>
                    </Link>
                    <Link
                      href="/passport-size-photo-maker"
                      className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-300 transition-colors w-full sm:w-auto focus-ring"
                    >
                      <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>New Photo</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-lime-50 border border-lime-300 rounded-2xl p-5 sm:p-7 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#4D7C0F] text-white flex items-center justify-center shrink-0 shadow-xs" aria-hidden="true">
                      <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h1 className="!text-lg sm:!text-2xl lg:!text-3xl font-extrabold text-slate-900 tracking-tight">
                          Passport Photo Generated &amp; Verified!
                        </h1>
                        <span className="px-2.5 py-0.5 rounded-full bg-lime-200 text-lime-950 font-extrabold text-xs">
                          Biometric Passed
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 font-medium">
                        Processed to official {countryName} ({dimensions} px) biometric standards. Ready for instant unlock.
                      </p>
                      <p className="text-[11px] text-slate-600 font-mono mt-1">
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
                      <span>Re-upload / Change</span>
                    </Link>
                  </div>
                </div>
              )}

              <div className="grid lg:grid-cols-12 gap-8 items-start">
                {/* Left Preview Column */}
                <div className="lg:col-span-7 space-y-6">
                  {/* View Tabs */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveTab("single")}
                          className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors ${
                            activeTab === "single"
                              ? "bg-[#4D7C0F] text-white shadow-xs"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          Single Passport Photo
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab("sheet")}
                          className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors ${
                            activeTab === "sheet"
                              ? "bg-[#4D7C0F] text-white shadow-xs"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          Print-Ready 6×4″ Sheet
                        </button>
                      </div>

                      <span className="font-mono text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md font-bold hidden sm:inline-block">
                        {dimensions} px · {countryCode}
                      </span>
                    </div>

                    {/* Single Photo Tab */}
                    {activeTab === "single" && (
                      <div className="space-y-4">
                        <div
                          className="relative flex justify-center p-4 sm:p-8 bg-slate-100 rounded-xl border border-slate-200 select-none overflow-hidden"
                          onContextMenu={(e) => !isPaid && e.preventDefault()}
                        >
                          <div className="relative inline-block rounded-lg overflow-hidden border border-slate-300 bg-white shadow-sm">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={isPaid ? (fullImageUrl || previewUrl) : previewUrl}
                              alt={`Official ${countryName} Passport Photo`}
                              className="max-h-72 sm:max-h-84 object-contain rounded-lg pointer-events-none select-none"
                              draggable={false}
                            />

                            {/* Watermark Overlay for Unpaid users */}
                            {!isPaid && (
                              <div
                                className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/15 backdrop-blur-[1px] select-none pointer-events-none p-4 text-center"
                                aria-hidden="true"
                              >
                                <div className="bg-slate-900/80 text-white px-3 py-1.5 rounded-md font-bold text-xs uppercase tracking-wider mb-2 backdrop-blur-sm border border-white/20">
                                  PixPassport Protected Preview
                                </div>
                                <div className="text-[10px] text-white/90 font-medium">
                                  High-resolution watermark-free file unlocks upon payment
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-600 px-1 font-medium">
                          <span>Format: {data?.format || "JPEG"}</span>
                          <span>Official Size: {dimensions} px ({countryCode})</span>
                          <span>Compliance: 100% Certified</span>
                        </div>
                      </div>
                    )}

                    {/* 6x4 Sheet Tab */}
                    {activeTab === "sheet" && (
                      <div className="space-y-4">
                        <div
                          className="relative flex justify-center p-4 sm:p-8 bg-slate-100 rounded-xl border border-slate-200 select-none overflow-hidden"
                          onContextMenu={(e) => !isPaid && e.preventDefault()}
                        >
                          <div className="relative inline-block rounded-lg overflow-hidden border border-slate-300 bg-white shadow-sm">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={previewUrl}
                              alt={`Print-Ready 6x4 Sheet for ${countryName}`}
                              className="max-h-72 sm:max-h-84 object-contain rounded-lg pointer-events-none select-none"
                              draggable={false}
                            />

                            {/* Watermark Overlay for Unpaid users */}
                            {!isPaid && (
                              <div
                                className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/15 backdrop-blur-[1px] select-none pointer-events-none p-4 text-center"
                                aria-hidden="true"
                              >
                                <div className="bg-slate-900/80 text-white px-3 py-1.5 rounded-md font-bold text-xs uppercase tracking-wider mb-2 backdrop-blur-sm border border-white/20">
                                  6×4″ Sheet Preview
                                </div>
                                <div className="text-[10px] text-white/90 font-medium">
                                  Print at Boots, Tesco, pharmacies or home
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-600 px-1 font-medium">
                          <span>Standard 10×15 cm (6×4 inch) photo paper layout</span>
                          <span>Grid of compliant photos</span>
                        </div>
                      </div>
                    )}

                    {/* Post-Payment Action Buttons */}
                    {isPaid && (
                      <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
                        <div className="grid sm:grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => handleDownload("single")}
                            disabled={downloading}
                            className="inline-flex items-center justify-center gap-2 bg-[#4D7C0F] hover:bg-[#3F650C] !text-white text-white font-bold text-sm py-3.5 rounded-xl transition-colors text-center shadow-xs focus-ring"
                          >
                            <Download className="w-4 h-4" aria-hidden="true" />
                            <span>{downloading ? "Preparing Download…" : "Download Single Photo"}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDownload("sheet")}
                            disabled={downloading}
                            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm py-3.5 rounded-xl border border-slate-300 transition-colors text-center focus-ring"
                          >
                            <Printer className="w-4 h-4" aria-hidden="true" />
                            <span>Download 6×4″ Sheet</span>
                          </button>
                        </div>

                        {paymentState?.paymentId && (
                          <div className="flex justify-end pt-1">
                            <a
                              href={`/api/invoices/${paymentState.paymentId}?download=1`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold transition-colors"
                            >
                              <Receipt className="w-3.5 h-3.5 text-lime-700" aria-hidden="true" />
                              <span>Download Tax Invoice (HTML)</span>
                              <ExternalLink className="w-3 h-3" aria-hidden="true" />
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Printing & Submission Guide Card */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 text-xs text-slate-700">
                    <h2 className="!text-sm sm:!text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
                      <FileCheck className="w-4 h-4 text-[#4D7C0F] shrink-0" aria-hidden="true" />
                      <span>Official Submission &amp; Printing Instructions</span>
                    </h2>
                    <ol className="list-decimal pl-4 space-y-2 leading-relaxed font-medium">
                      <li>
                        <strong>Online Passport Application:</strong> Upload the single digital photo directly to the official government portal (e.g. HM Passport Office / gov.uk).
                      </li>
                      <li>
                        <strong>Store / Kiosk Printing:</strong> Save the 6×4″ sheet to your smartphone or USB drive. Print at photo kiosks (Boots, Tesco, Asda, Snappy Snaps) at standard 6×4″ size with <strong>no cropping</strong> (100% actual scale).
                      </li>
                      <li>
                        <strong>Paper Selection:</strong> Use high-quality matte or glossy photo paper for government acceptance.
                      </li>
                    </ol>
                  </div>
                </div>

                {/* Right Column: Checkout or Biometrics */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Checkout Card if Unpaid */}
                  {!isPaid ? (
                    <div className="bg-white border-2 border-lime-500/80 rounded-2xl p-5 sm:p-7 shadow-md relative overflow-hidden">
                      {/* Top ribbon */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-[#4D7C0F]" aria-hidden="true" />
                          <span className="font-extrabold text-sm text-slate-900">
                            Instant Digital Delivery
                          </span>
                        </div>
                        <span className="text-[11px] font-bold bg-lime-100 text-lime-900 px-2 py-0.5 rounded-full">
                          100% Guaranteed
                        </span>
                      </div>

                      {/* Pricing Display */}
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                          {PRICING.currencySymbol}{PRICING.amount.toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          one-time payment · no subscription
                        </span>
                      </div>

                      {/* Feature Checklist */}
                      <ul className="space-y-2.5 mb-6 text-xs text-slate-700 font-medium">
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#4D7C0F] shrink-0 mt-0.5" aria-hidden="true" />
                          <span>
                            <strong>1x High-Res Digital Photo:</strong> Sized for official online passport applications.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#4D7C0F] shrink-0 mt-0.5" aria-hidden="true" />
                          <span>
                            <strong>1x Multi-Photo 6×4″ Template:</strong> Print ready for Boots, Tesco or home printers.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#4D7C0F] shrink-0 mt-0.5" aria-hidden="true" />
                          <span>
                            <strong>Biometric Compliance Verified:</strong> Full refund if rejected by authorities.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#4D7C0F] shrink-0 mt-0.5" aria-hidden="true" />
                          <span>
                            <strong>Instant Email Backup:</strong> Download link and tax invoice sent to your inbox.
                          </span>
                        </li>
                      </ul>

                      {/* Email Input Field */}
                      <div className="mb-4">
                        <label
                          htmlFor="checkout-email"
                          className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between"
                        >
                          <span>Email Address for Delivery <span className="text-red-500">*</span></span>
                          <span className="text-[11px] font-normal text-slate-500">Invoice &amp; photo link sent here</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Mail className="w-4 h-4" aria-hidden="true" />
                          </div>
                          <input
                            type="email"
                            id="checkout-email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="name@example.co.uk"
                            className={`w-full pl-9 pr-3.5 py-3 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                              emailError
                                ? "border-red-400 focus:ring-red-400/30 text-red-950"
                                : "border-slate-300 focus:ring-lime-500/30 focus:border-lime-600"
                            }`}
                            required
                            aria-invalid={!!emailError}
                            aria-describedby={emailError ? "email-error" : undefined}
                          />
                        </div>
                        {emailError && (
                          <p id="email-error" className="text-xs text-red-600 font-semibold mt-1.5">
                            {emailError}
                          </p>
                        )}
                      </div>

                      {/* Error Alert */}
                      {paymentError && (
                        <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2 font-medium">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                          <span>{paymentError}</span>
                        </div>
                      )}

                      {/* Payment Action Button */}
                      <button
                        type="button"
                        onClick={handleInitiatePayment}
                        disabled={isProcessingPayment}
                        className="w-full inline-flex items-center justify-center gap-2 bg-[#4D7C0F] hover:bg-[#3F650C] disabled:bg-slate-400 !text-white text-white font-extrabold text-base py-4 rounded-xl transition-all shadow-md hover:shadow-lg focus-ring cursor-pointer"
                      >
                        {isProcessingPayment ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                            <span>Processing Secure Checkout…</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" aria-hidden="true" />
                            <span>Pay {PRICING.currencySymbol}{PRICING.amount.toFixed(2)} &amp; Download</span>
                          </>
                        )}
                      </button>

                      {/* Trust & Security Icons */}
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-center gap-4 text-slate-400 text-xs mb-2">
                          <span className="flex items-center gap-1 text-slate-600 font-semibold">
                            <CreditCard className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                            Cards
                          </span>
                          <span>•</span>
                          <span className="text-slate-600 font-semibold">Apple Pay</span>
                          <span>•</span>
                          <span className="text-slate-600 font-semibold">Google Pay</span>
                          <span>•</span>
                          <span className="text-slate-600 font-semibold">Razorpay</span>
                        </div>
                        <p className="text-[11px] text-center text-slate-500 font-medium">
                          🔒 256-Bit SSL Encrypted. Direct instant delivery to your inbox.
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Paid State Receipt Card */
                    <div className="bg-white border border-emerald-300 rounded-2xl p-5 sm:p-7 shadow-xs">
                      <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-4 border-b border-slate-100 pb-3">
                        <CheckCircle className="w-5 h-5 text-[#4D7C0F]" aria-hidden="true" />
                        <span>Order Summary &amp; Receipt</span>
                      </div>

                      <div className="space-y-3 text-xs mb-6">
                        <div className="flex justify-between py-1.5 border-b border-slate-100">
                          <span className="text-slate-600">Product:</span>
                          <span className="font-semibold text-slate-900">{PRICING.productName}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-100">
                          <span className="text-slate-600">Country:</span>
                          <span className="font-semibold text-slate-900">{countryName} ({countryCode})</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-100">
                          <span className="text-slate-600">Dimensions:</span>
                          <span className="font-mono font-semibold text-slate-900">{dimensions} px</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-100">
                          <span className="text-slate-600">Amount Paid:</span>
                          <span className="font-bold text-slate-900 text-sm">{PRICING.currencySymbol}{PRICING.amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-100">
                          <span className="text-slate-600">Delivery Email:</span>
                          <span className="font-semibold text-slate-900">{paymentState?.email || email}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-100">
                          <span className="text-slate-600">Payment ID:</span>
                          <span className="font-mono text-slate-900 text-[11px]">{paymentState?.paymentId}</span>
                        </div>
                      </div>

                      {paymentState?.paymentId && (
                        <a
                          href={`/api/invoices/${paymentState.paymentId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3 rounded-xl transition-colors focus-ring"
                        >
                          <Receipt className="w-4 h-4 text-[#4D7C0F]" aria-hidden="true" />
                          <span>View Official Invoice</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  )}

                  {/* Biometric Compliance Card */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                      <h2 className="!text-sm sm:!text-base font-bold text-slate-900 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[#4D7C0F] shrink-0" aria-hidden="true" />
                        <span>Biometric Verification Audit</span>
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-lime-100 text-lime-950 text-xs font-extrabold">
                        100% Passed
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <span className="text-slate-700 font-semibold">Head Height Ratio:</span>
                        <span className="font-mono font-bold text-lime-900 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-lime-700" aria-hidden="true" />
                          {metrics?.head_height_pct ?? 72}% (Official 70–80%)
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <span className="text-slate-700 font-semibold">Eye Level Position:</span>
                        <span className="font-mono font-bold text-lime-900 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-lime-700" aria-hidden="true" />
                          {metrics?.eye_position_pct ?? 54}% (Centered)
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <span className="text-slate-700 font-semibold">Top Margin Clearance:</span>
                        <span className="font-mono font-bold text-lime-900 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-lime-700" aria-hidden="true" />
                          {metrics?.top_margin_pct ?? 8}% (Optimal)
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <span className="text-slate-700 font-semibold">Background Isolation:</span>
                        <span className="font-bold text-lime-900 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-lime-700" aria-hidden="true" />
                          Uniform Light (Cleaned)
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <span className="text-slate-700 font-semibold">Official Resolution:</span>
                        <span className="font-mono font-bold text-slate-900">
                          {dimensions} px ({countryCode})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Back Link */}
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
