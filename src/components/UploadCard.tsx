"use client";

import { useState, useRef, type ChangeEvent, type DragEvent } from "react";
import {
  Upload,
  ImagePlus,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function UploadCard() {
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
    // Simulated processing — replace with actual logic
    setTimeout(() => setIsProcessing(false), 2000);
  }

  return (
    <section className="bg-base-200 section-padding" id="upload">
      <div className="container-narrow">
        <div className="text-center mb-12">
          <h2 className="text-base-content mb-4">Upload Your Photo</h2>
          <p className="text-base-content/60 text-lg max-w-2xl mx-auto">
            Start by uploading a well-lit photo taken against a plain background.
            We'll guide you through the rest.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <div className="card bg-base-100 border border-base-300 card-shadow">
            <div className="card-body gap-6">
              {/* Error alert */}
              {error && (
                <div role="alert" className="alert alert-error">
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
                    or click to browse · JPEG, PNG, WebP · Max {MAX_FILE_SIZE_MB} MB
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <div className="bg-base-200 rounded-xl p-4 flex justify-center">
                    <img
                      src={preview}
                      alt="Uploaded photo preview"
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
                    <span className="text-base-content/40">
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
                  <p className="font-medium text-base-content/60">Photo tips:</p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li>Face the camera directly with a neutral expression</li>
                    <li>Use a plain white or light grey background</li>
                    <li>Ensure even lighting with no shadows on your face</li>
                    <li>Remove glasses, hats, and head coverings (unless religious)</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
