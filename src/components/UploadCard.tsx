"use client";

import {
  useState,
  useRef,
  type ChangeEvent,
  type DragEvent,
  type ReactNode,
} from "react";
import {
  Upload,
  ImagePlus,
  X,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export const DEFAULT_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const DEFAULT_TIPS = [
  "Face the camera directly with a neutral expression",
  "Use a plain white or light grey background",
  "Ensure even lighting with no shadows on your face",
  "Remove glasses, hats, and head coverings (unless religious)",
];

export interface UploadCardProps {
  id?: string;
  title?: string;
  subtitle?: string;
  acceptedTypes?: string[];
  maxFileSizeMB?: number;
  tipsTitle?: string;
  tips?: string[];
  ctaLabel?: string;
  processingLabel?: string;
  onUpload?: (file: File) => void;
  className?: string;
  children?: ReactNode;
}

export default function UploadCard({
  id = "upload",
  title = "Create Your Passport Picture Online",
  subtitle = "Upload a well-lit photo taken against a plain background to create a digital photo for your passport application or renewal.",
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  maxFileSizeMB = 10,
  tipsTitle = "Photo tips for official acceptance:",
  tips = DEFAULT_TIPS,
  ctaLabel = "Create Passport Photo",
  processingLabel = "Processing…",
  onUpload,
  className = "",
  children,
}: UploadCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024;

  function validate(f: File): string | null {
    if (!acceptedTypes.includes(f.type)) {
      return `Please upload an accepted format: ${acceptedTypes
        .map((t) => t.split("/")[1].toUpperCase())
        .join(", ")}.`;
    }
    if (f.size > maxFileSizeBytes) {
      return `File must be smaller than ${maxFileSizeMB} MB.`;
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
    if (onUpload) onUpload(f);

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
    // Simulated processing — replace with actual client canvas logic
    setTimeout(() => setIsProcessing(false), 2000);
  }

  return (
    <section
      className={`bg-base-200 section-padding ${className}`.trim()}
      id={id}
      aria-labelledby={`${id}-heading`}
    >
      <div className="container-narrow">
        <header className="text-center mb-12">
          <h2 id={`${id}-heading`} className="text-base-content mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base-content/60 text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </header>

        <div className="max-w-xl mx-auto">
          <div className="card bg-base-100 border border-base-300 card-shadow">
            <div className="card-body gap-6">
              {/* Error alert with live ARIA region */}
              {error && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="alert alert-error"
                >
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span className="flex-1 text-sm">{error}</span>
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
                  aria-label="Upload photo area. Click or drag and drop your photo here."
                >
                  <ImagePlus className="w-10 h-10 text-base-content/30 mx-auto mb-3" />
                  <p className="text-base-content/70 font-medium mb-1">
                    Drag &amp; drop your photo here
                  </p>
                  <p className="text-base-content/50 text-sm">
                    or click to browse ·{" "}
                    {acceptedTypes
                      .map((t) => t.split("/")[1].toUpperCase())
                      .join(", ")}{" "}
                    · Max {maxFileSizeMB} MB
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
                    className="btn btn-circle btn-sm btn-ghost absolute top-2 right-2 focus-ring"
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
                accept={acceptedTypes.join(",")}
                onChange={onFileChange}
                className="hidden"
                id={`${id}-file-input`}
                aria-label="Select photo file"
              />

              {/* File info & actions */}
              {file && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-sm text-base-content/60">
                    <CheckCircle className="w-4 h-4 text-success shrink-0" />
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
                        {processingLabel}
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        {ctaLabel}
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Tips */}
              {!file && tips && tips.length > 0 && (
                <aside
                  className="text-xs text-base-content/50 space-y-1.5 pt-2 border-t border-base-200"
                  aria-label="Photo guidelines"
                >
                  <p className="font-medium text-base-content/70">{tipsTitle}</p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </aside>
              )}

              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
