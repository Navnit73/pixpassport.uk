"use client";

/**
 * PassportPhotoChecker
 *
 * Self-contained, reusable passport / visa photo compliance checker.
 *
 * - Countries:     GET {API}/countries
 * - Requirements:  GET {API}/countries/{code}?document_type={type}
 * - Analysis runs entirely in the browser (MediaPipe Face Landmarker, Face
 *   Detector and Selfie Segmenter loaded on demand). The photo never leaves
 *   the device.
 *
 * Validation is data-driven: `analysePhoto()` measures the image without any
 * knowledge of a country, and `evaluatePhoto()` compares those measurements
 * with whatever rules the API returns. A rule the API does not publish is not
 * checked, so adding a country needs no change here.
 */

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import {
  ArrowRight,
  CircleCheck,
  CircleHelp,
  CircleQuestionMark,
  CircleX,
  ClipboardCheck,
  Cpu,
  Eye,
  EyeOff,
  ImagePlus,
  Info,
  RefreshCw,
  RotateCcw,
  Ruler,
  ScanFace,
  ShieldCheck,
  TriangleAlert,
  Wand2,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type {
  FaceDetector,
  FaceLandmarker,
  ImageSegmenter,
  NormalizedLandmark,
} from "@mediapipe/tasks-vision";
import { compressImageTo3MB } from "@/lib/image-compress";
import {
  readFileAsDataUrl,
  requestPhotoProcessing,
  saveProcessedResult,
} from "@/lib/photo-processing";

/* ========================================================================== */
/* Public types & defaults                                                    */
/* ========================================================================== */

export interface PassportPhotoCheckerProps {
  /** ISO-style country code from the PixPassport API, e.g. "GB". */
  defaultCountryCode?: string;
  /** Document type from the PixPassport API, e.g. "passport". */
  defaultDocumentType?: string;
  heading?: string;
  description?: string;
  headingLevel?: "h2" | "h3";
  /**
   * Shows "Fix my photo automatically", which sends the photo the user already
   * uploaded to the processing API and opens the preview page.
   */
  enableAutoFix?: boolean;
  fixPhotoLabel?: string;
  className?: string;
  /** Called whenever a full report is available (new photo or new country). */
  onReport?: (report: PassportPhotoReport) => void;
}

export const PASSPORT_PHOTO_CHECKER_DEFAULTS = {
  defaultCountryCode: "GB",
  defaultDocumentType: "passport",
  heading: "Passport Photo Checker",
  description:
    "Choose a country, then upload your photo. We check it against that country's published photo rules, right here in your browser.",
  headingLevel: "h2",
  enableAutoFix: true,
  fixPhotoLabel: "Fix my photo automatically",
} as const satisfies Partial<PassportPhotoCheckerProps>;

export interface CountrySummary {
  country_code: string;
  country_name: string;
  document_type: string;
  dimensions?: string;
}

interface NumericRange {
  min?: number | null;
  max?: number | null;
  recommended?: number | null;
}

interface PixelSize {
  width: number;
  height: number;
}

/** Shape of GET /countries/{code} (schema_version 1.0). Every rule is optional. */
export interface CountryRequirements {
  schema_version?: string;
  country: { name: string; code: string };
  document_type: string;
  photo_spec?: {
    width_in?: number | null;
    height_in?: number | null;
    width_mm?: number | null;
    height_mm?: number | null;
    aspect_ratio?: number | null;
    print_dpi?: number | null;
  } | null;
  digital_requirements?: {
    required_resolution_px?: PixelSize | null;
    min_resolution_px?: PixelSize | null;
    max_resolution_px?: PixelSize | null;
    max_file_size_kb?: number | null;
    format?: string[] | null;
    background_color?: string | null;
  } | null;
  face_constraints?: {
    head_height_pct?: NumericRange | null;
    eye_position?: { from_bottom_pct?: NumericRange | null } | null;
    top_margin_pct?: NumericRange | null;
    chin_to_bottom_pct?: NumericRange | null;
  } | null;
  pose_rules?: {
    head_tilt_allowed?: boolean | null;
    expression?: string | null;
    eyes_open?: boolean | null;
    mouth_closed?: boolean | null;
    both_ears_visible?: boolean | null;
  } | null;
  background_rules?: {
    color?: string | null;
    shadows_allowed?: boolean | null;
    texture_allowed?: boolean | null;
  } | null;
  auto_crop_config?: {
    head_top_multiplier?: number | null;
    eye_line_target_pct?: number | null;
    safe_padding_pct?: number | null;
  } | null;
}

export type CheckStatus = "pass" | "warning" | "fail" | "manual" | "unavailable";
/** verified = exact reading of the file; estimate = computer vision; manual = needs a human. */
export type CheckBasis = "verified" | "estimate" | "manual";

export interface PhotoCheck {
  id: string;
  label: string;
  basis: CheckBasis;
  status: CheckStatus;
  measured?: string;
  requirement?: string;
  detail?: string;
  suggestion?: string;
}

export interface PassportPhotoReport {
  countryCode: string;
  countryName: string;
  documentType: string;
  verdict: "pass" | "warning" | "fail";
  checks: PhotoCheck[];
  requirements: CountryRequirements;
}

/* ========================================================================== */
/* Configuration (tooling only — no country rules live here)                  */
/* ========================================================================== */

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_PIX_PASSPORT_API_URL || "https://api.pixpassport.com"
).replace(/\/+$/, "");

/** Keep in sync with the @mediapipe/tasks-vision version in package.json. */
const MEDIAPIPE_VERSION = "1.0.1";
const MEDIAPIPE_WASM_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}/wasm`;
const MODEL_URLS = {
  landmarker:
    "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
  detector:
    "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
  segmenter:
    "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/1/selfie_segmenter.tflite",
};

const FETCH_TIMEOUT_MS = 15_000;
/** Refuse to decode absurdly large uploads (protects low-memory devices). */
const MAX_DECODE_BYTES = 40 * 1024 * 1024;
const FACE_CANVAS_MAX_EDGE = 1280;
const BACKGROUND_CANVAS_MAX_EDGE = 384;
const MIN_DETECTION_CONFIDENCE = 0.5;

/**
 * Crown sits above MediaPipe's forehead landmark (#10). The API publishes the
 * forehead→crown multiplier per country in `auto_crop_config`; this
 * anthropometric average is only used if a country omits it.
 */
const FALLBACK_HEAD_TOP_MULTIPLIER = 1.24;

/**
 * Margins of error for the computer-vision estimates. A reading this close to
 * a limit is reported as a warning instead of a hard fail. These describe the
 * accuracy of the measurement, not any country's rules.
 */
const ESTIMATE_TOLERANCE = {
  framingPct: 2,
  aspectRatioPass: 0.01,
  aspectRatioWarn: 0.03,
  rollDeg: { warn: 4, fail: 8 },
  yawDeg: { warn: 8, fail: 15 },
  pitchDeg: { warn: 15 },
  eyeBlink: { warn: 0.4, fail: 0.55 },
  jawOpen: { warn: 0.12, fail: 0.25 },
  lipGapRatio: { warn: 0.025, fail: 0.045 },
  smile: { warn: 0.3, fail: 0.5 },
  colourViolation: 6,
  shadowDepth: { warn: 10, fail: 18 },
  unevenness: { warn: 6, fail: 12 },
  texture: { warn: 2.5, fail: 5 },
} as const;

/** Generic colour vocabulary used to interpret the API's background colour text. */
interface ColourSpec {
  label: string;
  /** Reference colour shown next to the measured background. */
  swatch: string;
  minL?: number;
  maxL?: number;
  minChroma?: number;
  maxChroma?: number;
  hue?: [number, number];
}

const BACKGROUND_COLOUR_VOCABULARY: Array<{ pattern: RegExp; spec: ColourSpec }> = [
  { pattern: /off[\s-]?white|cream|ivory/, spec: { label: "off-white / cream", swatch: "rgb(246 241 226)", minL: 82, maxChroma: 20 } },
  { pattern: /white/, spec: { label: "white", swatch: "rgb(255 255 255)", minL: 88, maxChroma: 10 } },
  { pattern: /(light|pale)\s*gr[ae]y/, spec: { label: "light grey", swatch: "rgb(214 216 218)", minL: 70, maxL: 95, maxChroma: 10 } },
  { pattern: /gr[ae]y/, spec: { label: "grey", swatch: "rgb(170 172 175)", minL: 45, maxL: 92, maxChroma: 10 } },
  { pattern: /(light|pale|sky)\s*blue/, spec: { label: "light blue", swatch: "rgb(170 204 236)", minL: 55, minChroma: 10, hue: [220, 320] } },
  { pattern: /blue/, spec: { label: "blue", swatch: "rgb(46 94 178)", minL: 25, minChroma: 15, hue: [220, 320] } },
];

/* ========================================================================== */
/* API helpers (module-level caches are shared by every instance)             */
/* ========================================================================== */

class CheckerError extends Error {}

let countriesCache: Promise<CountrySummary[]> | null = null;
const requirementsCache = new Map<string, Promise<CountryRequirements>>();

async function fetchJson<T>(url: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch {
    throw new CheckerError("Couldn't reach the PixPassport requirements service. Check your connection and try again.");
  }
  if (!response.ok) {
    let detail = "";
    try {
      const body = await response.json();
      detail = typeof body?.detail === "string" ? body.detail : "";
    } catch {
      // non-JSON error body
    }
    if (response.status === 404) {
      throw new CheckerError(detail || "No photo requirements are published for this selection yet.");
    }
    throw new CheckerError(detail || `The requirements service returned an error (${response.status}).`);
  }
  return response.json() as Promise<T>;
}

function loadCountries(): Promise<CountrySummary[]> {
  if (!countriesCache) {
    countriesCache = fetchJson<CountrySummary[]>(`${API_BASE_URL}/countries`)
      .then((list) => {
        if (!Array.isArray(list)) throw new CheckerError("Unexpected country list from the API.");
        const seen = new Set<string>();
        return list
          .filter((c) => c && typeof c.country_code === "string" && typeof c.country_name === "string")
          .map((c) => ({ ...c, document_type: c.document_type || "passport" }))
          .filter((c) => {
            const key = `${c.country_code}|${c.document_type}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          })
          .sort((a, b) => a.country_name.localeCompare(b.country_name, "en-GB"));
      })
      .catch((err) => {
        countriesCache = null;
        throw err;
      });
  }
  return countriesCache;
}

function loadRequirements(code: string, documentType: string): Promise<CountryRequirements> {
  const key = `${code}|${documentType}`;
  let pending = requirementsCache.get(key);
  if (!pending) {
    const url = `${API_BASE_URL}/countries/${encodeURIComponent(code)}?document_type=${encodeURIComponent(documentType)}`;
    pending = fetchJson<CountryRequirements>(url)
      .then((data) => {
        if (!data || typeof data !== "object" || !data.country) {
          throw new CheckerError("Unexpected requirements format from the API.");
        }
        return data;
      })
      .catch((err) => {
        requirementsCache.delete(key);
        throw err;
      });
    requirementsCache.set(key, pending);
  }
  return pending;
}

/* ========================================================================== */
/* MediaPipe model lifecycle (lazy, shared, reference counted)                */
/* ========================================================================== */

interface VisionModels {
  landmarker: FaceLandmarker;
  detector: FaceDetector | null;
  segmenter: ImageSegmenter | null;
  /** Set once the shared models have been released; analyses must not use them after that. */
  closed: boolean;
}

let visionModelsPromise: Promise<VisionModels> | null = null;
let visionModelUsers = 0;

async function createVisionModels(): Promise<VisionModels> {
  const vision = await import("@mediapipe/tasks-vision");
  const fileset = await vision.FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_URL);
  // CPU delegate: single still images are fast enough and it avoids WebGL quirks (notably Safari).
  const landmarkerPending = vision.FaceLandmarker.createFromOptions(fileset, {
    baseOptions: { modelAssetPath: MODEL_URLS.landmarker, delegate: "CPU" },
    runningMode: "IMAGE",
    numFaces: 2,
    outputFaceBlendshapes: true,
  });
  // Detector and segmenter are optional extras; the landmarker alone still gives a result.
  const optionalPending = Promise.all([
    vision.FaceDetector.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: MODEL_URLS.detector, delegate: "CPU" },
      runningMode: "IMAGE",
      minDetectionConfidence: MIN_DETECTION_CONFIDENCE,
    }).catch(() => null),
    vision.ImageSegmenter.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: MODEL_URLS.segmenter, delegate: "CPU" },
      runningMode: "IMAGE",
      outputConfidenceMasks: true,
      outputCategoryMask: false,
    }).catch(() => null),
  ]);
  let landmarker: FaceLandmarker;
  try {
    landmarker = await landmarkerPending;
  } catch (err) {
    // Don't leak the optional models that did load.
    void optionalPending.then(([detector, segmenter]) => {
      detector?.close();
      segmenter?.close();
    });
    throw err;
  }
  const [detector, segmenter] = await optionalPending;
  return { landmarker, detector, segmenter, closed: false };
}

function getVisionModels(): Promise<VisionModels> {
  if (!visionModelsPromise) {
    visionModelsPromise = createVisionModels().catch((err) => {
      visionModelsPromise = null;
      throw err;
    });
  }
  return visionModelsPromise;
}

function retainVisionModels() {
  visionModelUsers += 1;
}

function releaseVisionModels() {
  visionModelUsers = Math.max(0, visionModelUsers - 1);
  if (visionModelUsers === 0 && visionModelsPromise) {
    const pending = visionModelsPromise;
    visionModelsPromise = null;
    pending
      .then((models) => {
        models.closed = true;
        models.landmarker.close();
        models.detector?.close();
        models.segmenter?.close();
      })
      .catch(() => {});
  }
}

/* ========================================================================== */
/* Image analysis (country independent)                                       */
/* ========================================================================== */

type FileFormat = "jpeg" | "png" | "webp" | "gif" | "bmp" | "heic" | "avif" | "unknown";
type AnalysisStage = "decoding" | "models" | "face" | "background";

interface FaceBox {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

interface FaceMeasurements {
  landmarks: NormalizedLandmark[];
  box: FaceBox;
  /** All y values are normalised 0–1 from the top edge. */
  foreheadY: number;
  chinY: number;
  eyeY: number;
  rollDeg: number;
  yawDeg: number;
  pitchDeg: number;
  lipGapRatio: number;
  blendshapes: Record<string, number>;
}

interface BackgroundMeasurements {
  method: "segmentation" | "border-sample";
  sampleFraction: number;
  /** Mean sRGB of the background pixels, for display. */
  meanRgb: [number, number, number];
  lightness: number;
  chroma: number;
  hue: number;
  unevenness: number;
  shadowDepth: number;
  texture: number;
}

interface ImageAnalysis {
  file: { name: string; sizeBytes: number; format: FileFormat; width: number; height: number };
  /** null when the AI models could not load. */
  faceCount: number | null;
  detectionConfidence: number | null;
  detectorBoxes: FaceBox[];
  face: FaceMeasurements | null;
  background: BackgroundMeasurements | null;
  modelError: string | null;
}

function detectFormat(bytes: Uint8Array): FileFormat {
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpeg";
  if (bytes[0] === 0x89 && ascii(1, 4) === "PNG") return "png";
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "webp";
  if (ascii(0, 4) === "GIF8") return "gif";
  if (bytes[0] === 0x42 && bytes[1] === 0x4d) return "bmp";
  if (ascii(4, 8) === "ftyp") {
    const brand = ascii(8, 12);
    if (brand.startsWith("avi")) return "avif";
    if (["heic", "heix", "hevc", "heim", "heis", "mif1", "msf1"].includes(brand)) return "heic";
  }
  return "unknown";
}

function normaliseFormat(format: string): string {
  const f = format.trim().toLowerCase().replace(/^\./, "");
  if (f === "jpg") return "jpeg";
  if (f === "heif") return "heic";
  return f;
}

function formatLabel(format: string): string {
  return format === "unknown" ? "Unrecognised" : format === "jpeg" ? "JPEG" : format.toUpperCase();
}

function drawScaled(source: ImageBitmap, maxEdge: number, willReadFrequently: boolean) {
  const scale = Math.min(1, maxEdge / Math.max(source.width, source.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(source.width * scale));
  canvas.height = Math.max(1, Math.round(source.height * scale));
  const ctx = canvas.getContext("2d", { willReadFrequently });
  if (!ctx) throw new CheckerError("Your browser couldn't create an image canvas.");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  return { canvas, ctx };
}

const SRGB_TO_LINEAR = Array.from({ length: 256 }, (_, i) => {
  const c = i / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
});

function rgbToLab(r: number, g: number, b: number): [number, number, number] {
  const R = SRGB_TO_LINEAR[r];
  const G = SRGB_TO_LINEAR[g];
  const B = SRGB_TO_LINEAR[b];
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const fx = f((R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047);
  const fy = f(R * 0.2126 + G * 0.7152 + B * 0.0722);
  const fz = f((R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

const toDeg = (rad: number) => (rad * 180) / Math.PI;

/** Folds an angle into −90…90° so that a reversed point order doesn't read as a 180° tilt. */
function foldAngle(deg: number): number {
  let d = deg;
  while (d > 90) d -= 180;
  while (d < -90) d += 180;
  return d;
}

function measureFace(
  landmarks: NormalizedLandmark[],
  blendshapeCategories: { categoryName: string; score: number }[] | undefined,
  width: number,
  height: number,
): FaceMeasurements {
  const p = (i: number) => landmarks[i];
  let x0 = 1, y0 = 1, x1 = 0, y1 = 0;
  for (const l of landmarks) {
    x0 = Math.min(x0, l.x);
    y0 = Math.min(y0, l.y);
    x1 = Math.max(x1, l.x);
    y1 = Math.max(y1, l.y);
  }
  // 468/473 are iris centres (present in the 478-point model); fall back to eye corners.
  const eyeY =
    landmarks.length > 473
      ? (p(468).y + p(473).y) / 2
      : (p(33).y + p(133).y + p(263).y + p(362).y) / 4;
  const forehead = p(10);
  const chin = p(152);
  const faceHeightPx = Math.max(1e-6, (chin.y - forehead.y) * height);
  // z uses roughly the same scale as x (image width), so depth differences give yaw/pitch.
  const rollDeg = foldAngle(toDeg(Math.atan2((p(263).y - p(33).y) * height, (p(263).x - p(33).x) * width)));
  const yawDeg = foldAngle(toDeg(Math.atan2(p(454).z - p(234).z, p(454).x - p(234).x)));
  const pitchDeg = foldAngle(toDeg(Math.atan2(chin.z - forehead.z, ((chin.y - forehead.y) * height) / width)));

  const blendshapes: Record<string, number> = {};
  for (const c of blendshapeCategories ?? []) blendshapes[c.categoryName] = c.score;

  return {
    landmarks,
    box: { x0, y0, x1, y1 },
    foreheadY: forehead.y,
    chinY: chin.y,
    eyeY,
    rollDeg,
    yawDeg,
    pitchDeg,
    lipGapRatio: Math.max(0, (p(14).y - p(13).y) * height) / faceHeightPx,
    blendshapes,
  };
}

/** Returns a person-probability mask resampled to w×h, or null if segmentation is unusable. */
function extractPersonMask(
  segmenter: ImageSegmenter,
  canvas: HTMLCanvasElement,
  face: FaceBox | null,
): Float32Array | null {
  const { width: w, height: h } = canvas;
  const result = segmenter.segment(canvas);
  try {
    const masks = (result.confidenceMasks ?? []).map((mask) => {
      const raw = mask.getAsFloat32Array();
      if (mask.width === w && mask.height === h) return Float32Array.from(raw);
      const resampled = new Float32Array(w * h);
      for (let y = 0; y < h; y++) {
        const my = Math.min(mask.height - 1, Math.floor((y * mask.height) / h));
        for (let x = 0; x < w; x++) {
          resampled[y * w + x] = raw[my * mask.width + Math.min(mask.width - 1, Math.floor((x * mask.width) / w))];
        }
      }
      return resampled;
    });
    if (!masks.length) return null;
    // Without a face we can't tell which channel is the person; fall back to border sampling.
    if (!face) return null;

    // Pick whichever channel is "person" by checking which one covers the face.
    const meanInFace = (m: Float32Array) => {
      let sum = 0, count = 0;
      for (let y = Math.floor(face.y0 * h); y < Math.ceil(face.y1 * h); y++) {
        for (let x = Math.floor(face.x0 * w); x < Math.ceil(face.x1 * w); x++) {
          if (x < 0 || y < 0 || x >= w || y >= h) continue;
          sum += m[y * w + x];
          count++;
        }
      }
      return count ? sum / count : 0;
    };
    let best = masks[0];
    let bestScore = meanInFace(best);
    for (const m of masks.slice(1)) {
      const s = meanInFace(m);
      if (s > bestScore) {
        best = m;
        bestScore = s;
      }
    }
    if (masks.length === 1 && bestScore < 0.5) {
      for (let i = 0; i < best.length; i++) best[i] = 1 - best[i];
      bestScore = 1 - bestScore;
    }
    return bestScore >= 0.5 ? best : null;
  } finally {
    result.close();
  }
}

function measureBackground(
  image: ImageData,
  personMask: Float32Array | null,
  face: FaceMeasurements | null,
): BackgroundMeasurements | null {
  const { width: w, height: h, data } = image;
  const n = w * h;
  const L = new Float32Array(n);
  const A = new Float32Array(n);
  const B = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const [l, a, b] = rgbToLab(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]);
    L[i] = l;
    A[i] = a;
    B[i] = b;
  }

  // Exclude an expanded box around the face so hair and ears never count as background.
  const box = face?.box;
  const fw = box ? box.x1 - box.x0 : 0;
  const fh = box ? box.y1 - box.y0 : 0;
  const ex = box
    ? { x0: (box.x0 - fw * 0.35) * w, x1: (box.x1 + fw * 0.35) * w, y0: (box.y0 - fh * 0.6) * h, y1: (box.y1 + fh * 0.15) * h }
    : null;
  const inExclusion = (x: number, y: number) => !!ex && x >= ex.x0 && x <= ex.x1 && y >= ex.y0 && y <= ex.y1;

  const isBg = new Uint8Array(n);
  const method: BackgroundMeasurements["method"] = personMask ? "segmentation" : "border-sample";
  if (personMask) {
    const r = Math.max(2, Math.round(w / 128)); // erode the mask edge (hair, soft shoulders)
    const bgAt = (x: number, y: number) =>
      x < 0 || y < 0 || x >= w || y >= h || personMask[y * w + x] < 0.15;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (bgAt(x, y) && bgAt(x - r, y) && bgAt(x + r, y) && bgAt(x, y - r) && bgAt(x, y + r) && !inExclusion(x, y)) {
          isBg[y * w + x] = 1;
        }
      }
    }
  } else {
    // No segmentation: sample the top strip and the upper side strips.
    const sideLimit = (face ? face.chinY : 0.6) * h;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const strip = y < h * 0.12 || ((x < w * 0.12 || x > w * 0.88) && y < sideLimit);
        if (strip && !inExclusion(x, y)) isBg[y * w + x] = 1;
      }
    }
  }

  const cx = box ? ((box.x0 + box.x1) / 2) * w : w / 2;
  const cy = face ? face.eyeY * h : h / 2;
  const histogram = new Uint32Array(101);
  let count = 0, sumL = 0, sumA = 0, sumB = 0;
  const sumRgb = [0, 0, 0];
  const halves = { left: [0, 0], right: [0, 0], top: [0, 0], bottom: [0, 0] };
  let lapSum = 0, lapCount = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (!isBg[i]) continue;
      const l = L[i];
      count++;
      sumL += l;
      sumA += A[i];
      sumB += B[i];
      sumRgb[0] += data[i * 4];
      sumRgb[1] += data[i * 4 + 1];
      sumRgb[2] += data[i * 4 + 2];
      histogram[Math.max(0, Math.min(100, Math.round(l)))]++;
      const side = x < cx ? halves.left : halves.right;
      side[0] += l;
      side[1]++;
      const band = y < cy ? halves.top : halves.bottom;
      band[0] += l;
      band[1]++;
      if (x > 0 && y > 0 && x < w - 1 && y < h - 1 && isBg[i - 1] && isBg[i + 1] && isBg[i - w] && isBg[i + w]) {
        lapSum += Math.abs(4 * l - L[i - 1] - L[i + 1] - L[i - w] - L[i + w]);
        lapCount++;
      }
    }
  }
  if (count < Math.max(200, n * 0.02)) return null;

  const percentile = (q: number) => {
    const target = count * q;
    let acc = 0;
    for (let v = 0; v <= 100; v++) {
      acc += histogram[v];
      if (acc >= target) return v;
    }
    return 100;
  };
  const meanOf = ([sum, c]: number[]) => (c > count * 0.05 ? sum / c : null);
  const diff = (a: number | null, b: number | null) => (a === null || b === null ? 0 : Math.abs(a - b));
  const meanA = sumA / count;
  const meanB = sumB / count;

  return {
    method,
    sampleFraction: count / n,
    meanRgb: [Math.round(sumRgb[0] / count), Math.round(sumRgb[1] / count), Math.round(sumRgb[2] / count)],
    lightness: sumL / count,
    chroma: Math.hypot(meanA, meanB),
    hue: (toDeg(Math.atan2(meanB, meanA)) + 360) % 360,
    unevenness: Math.max(
      diff(meanOf(halves.left), meanOf(halves.right)),
      diff(meanOf(halves.top), meanOf(halves.bottom)),
    ),
    shadowDepth: percentile(0.5) - percentile(0.05),
    texture: lapCount ? lapSum / lapCount : 0,
  };
}

async function analysePhoto(file: File, onStage: (stage: AnalysisStage) => void): Promise<ImageAnalysis> {
  onStage("decoding");
  if (file.size > MAX_DECODE_BYTES) {
    throw new CheckerError(`This file is ${(file.size / 1024 / 1024).toFixed(0)} MB. Please upload an image under ${MAX_DECODE_BYTES / 1024 / 1024} MB.`);
  }
  const format = detectFormat(new Uint8Array(await file.slice(0, 32).arrayBuffer()));

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new CheckerError(
      format === "heic" || format === "avif"
        ? `Your browser can't open ${formatLabel(format)} images. Export the photo as JPEG and try again.`
        : "This file couldn't be opened as an image. It may be corrupted or in an unsupported format.",
    );
  }

  const width = bitmap.width;
  const height = bitmap.height;
  let faceCanvas: HTMLCanvasElement;
  let bgCanvas: HTMLCanvasElement;
  let bgCtx: CanvasRenderingContext2D;
  try {
    faceCanvas = drawScaled(bitmap, FACE_CANVAS_MAX_EDGE, false).canvas;
    ({ canvas: bgCanvas, ctx: bgCtx } = drawScaled(bitmap, BACKGROUND_CANVAS_MAX_EDGE, true));
  } finally {
    bitmap.close();
  }

  const analysis: ImageAnalysis = {
    file: { name: file.name, sizeBytes: file.size, format, width, height },
    faceCount: null,
    detectionConfidence: null,
    detectorBoxes: [],
    face: null,
    background: null,
    modelError: null,
  };

  onStage("models");
  let models: VisionModels | null = null;
  try {
    models = await getVisionModels();
  } catch {
    analysis.modelError = "The on-device AI models couldn't be loaded, so face checks were skipped.";
  }

  onStage("face");
  // Yield so the stage message paints before the synchronous inference runs.
  await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
  // The models may have been released (component unmounted) while we yielded.
  if (models?.closed) throw new CheckerError("The check was cancelled.");
  let personMask: Float32Array | null = null;
  if (models) {
    // From here inference is one synchronous block, so the models can't be closed mid-run.
    const landmarkResult = models.landmarker.detect(faceCanvas);
    const detections = models.detector
      ? models.detector.detect(faceCanvas).detections.filter((d) => (d.categories[0]?.score ?? 0) >= MIN_DETECTION_CONFIDENCE)
      : null;

    analysis.detectorBoxes = (detections ?? []).flatMap((d) =>
      d.boundingBox
        ? [{
            x0: d.boundingBox.originX / faceCanvas.width,
            y0: d.boundingBox.originY / faceCanvas.height,
            x1: (d.boundingBox.originX + d.boundingBox.width) / faceCanvas.width,
            y1: (d.boundingBox.originY + d.boundingBox.height) / faceCanvas.height,
          }]
        : [],
    );
    analysis.detectionConfidence = detections?.length
      ? Math.max(...detections.map((d) => d.categories[0]?.score ?? 0))
      : null;
    analysis.faceCount = Math.max(detections?.length ?? 0, landmarkResult.faceLandmarks.length);

    if (landmarkResult.faceLandmarks.length) {
      let primary = 0;
      let largest = -1;
      landmarkResult.faceLandmarks.forEach((lms, i) => {
        const xs = lms.map((l) => l.x);
        const ys = lms.map((l) => l.y);
        const area = (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys));
        if (area > largest) {
          largest = area;
          primary = i;
        }
      });
      analysis.face = measureFace(
        landmarkResult.faceLandmarks[primary],
        landmarkResult.faceBlendshapes?.[primary]?.categories,
        faceCanvas.width,
        faceCanvas.height,
      );
    }

    if (models.segmenter) {
      try {
        personMask = extractPersonMask(models.segmenter, bgCanvas, analysis.face?.box ?? analysis.detectorBoxes[0] ?? null);
      } catch {
        personMask = null; // fall back to border sampling
      }
    }
  }

  onStage("background");
  analysis.background = measureBackground(bgCtx.getImageData(0, 0, bgCanvas.width, bgCanvas.height), personMask, analysis.face);
  return analysis;
}

/* ========================================================================== */
/* Evaluation (pure, driven only by API data)                                 */
/* ========================================================================== */

interface Evaluation {
  checks: PhotoCheck[];
  verdict: PassportPhotoReport["verdict"];
  geometry: { crownY: number; chinY: number; eyeY: number } | null;
  eyeBand: [number, number] | null;
  /** Data for the background colour card; null when the API sets no colour rule. */
  background: {
    requirement: string;
    required: ColourSpec[];
    measuredRgb: [number, number, number] | null;
    measuredLabel: string | null;
  } | null;
}

const pct = (v: number) => `${v.toFixed(1)}%`;
const num = (v: number | null | undefined): v is number => typeof v === "number" && Number.isFinite(v);

/** A range only counts as a rule if the API gave at least one bound. */
const hasBounds = (range: NumericRange | null | undefined): range is NumericRange =>
  !!range && (num(range.min) || num(range.max));

function rangeText(range: NumericRange, unit = "%"): string {
  if (num(range.min) && num(range.max)) return `${range.min}–${range.max}${unit}`;
  if (num(range.min)) return `at least ${range.min}${unit}`;
  if (num(range.max)) return `at most ${range.max}${unit}`;
  return "—";
}

/** Compares an estimate with a range; readings just outside the range become warnings. */
function rangeStatus(value: number, range: NumericRange, tolerance: number): { status: CheckStatus; side: "low" | "high" | null } {
  if (num(range.min) && value < range.min) {
    return { status: value >= range.min - tolerance ? "warning" : "fail", side: "low" };
  }
  if (num(range.max) && value > range.max) {
    return { status: value <= range.max + tolerance ? "warning" : "fail", side: "high" };
  }
  return { status: "pass", side: null };
}

function thresholdStatus(value: number, limits: { warn: number; fail?: number }): CheckStatus {
  if (num(limits.fail) && value >= limits.fail) return "fail";
  if (value >= limits.warn) return "warning";
  return "pass";
}

const worst = (...statuses: CheckStatus[]): CheckStatus =>
  statuses.includes("fail") ? "fail" : statuses.includes("warning") ? "warning" : "pass";

function parseColourSpecs(text: string): ColourSpec[] {
  return text
    .toLowerCase()
    .split(/\s*(?:,|\/|&|\bor\b|\band\b)\s*/)
    .flatMap((token) => {
      const hit = BACKGROUND_COLOUR_VOCABULARY.find((entry) => entry.pattern.test(token));
      return hit ? [hit.spec] : [];
    });
}

function colourViolation(bg: BackgroundMeasurements, spec: ColourSpec): number {
  let v = 0;
  if (num(spec.minL)) v += Math.max(0, spec.minL - bg.lightness);
  if (num(spec.maxL)) v += Math.max(0, bg.lightness - spec.maxL);
  if (num(spec.minChroma)) v += Math.max(0, spec.minChroma - bg.chroma);
  if (num(spec.maxChroma)) v += Math.max(0, bg.chroma - spec.maxChroma);
  if (spec.hue && bg.chroma > 4) {
    const [lo, hi] = spec.hue;
    if (bg.hue < lo || bg.hue > hi) v += Math.min(Math.abs(bg.hue - lo), Math.abs(bg.hue - hi)) / 5;
  }
  return v;
}

function describeColour(bg: BackgroundMeasurements): string {
  if (bg.chroma < 8) {
    if (bg.lightness >= 88) return "white";
    if (bg.lightness >= 70) return "light grey";
    if (bg.lightness >= 45) return "grey";
    return "dark";
  }
  const tone = bg.lightness >= 70 ? "light " : bg.lightness < 40 ? "dark " : "";
  if (bg.hue >= 60 && bg.hue < 110) return `${tone}cream / yellowish`;
  if (bg.hue >= 110 && bg.hue < 220) return `${tone}greenish`;
  if (bg.hue >= 220 && bg.hue < 320) return `${tone}bluish`;
  return `${tone}warm / pinkish`;
}

function evaluatePhoto(analysis: ImageAnalysis, req: CountryRequirements): Evaluation {
  const checks: PhotoCheck[] = [];
  const digital = req.digital_requirements ?? {};
  const framing = req.face_constraints ?? {};
  const pose = req.pose_rules ?? {};
  const bgRules = req.background_rules ?? {};
  const { file } = analysis;

  /* ---------- Verified measurements ---------- */

  const allowedFormats = [...new Set((digital.format ?? []).map(normaliseFormat))];
  if (allowedFormats.length) {
    const ok = allowedFormats.includes(file.format);
    const wanted = allowedFormats.map(formatLabel).join(" or ");
    checks.push({
      id: "format",
      label: "File format",
      basis: "verified",
      status: ok ? "pass" : file.format === "unknown" ? "warning" : "fail",
      measured: formatLabel(file.format),
      requirement: wanted,
      suggestion: ok ? undefined : `Save or export the photo as ${wanted}.`,
    });
  }

  if (num(digital.max_file_size_kb)) {
    const kb = file.sizeBytes / 1024;
    const limit = digital.max_file_size_kb;
    const show = (v: number) => (v >= 1024 ? `${(v / 1024).toFixed(1)} MB` : `${Math.round(v)} KB`);
    checks.push({
      id: "file-size",
      label: "File size",
      basis: "verified",
      status: kb <= limit ? "pass" : "fail",
      measured: show(kb),
      requirement: `at most ${show(limit)}`,
      suggestion: kb <= limit ? undefined : "Re-save the JPEG at a slightly lower quality, or resize it closer to the minimum resolution.",
    });
  }

  const minRes = digital.min_resolution_px ?? digital.required_resolution_px;
  const dims = `${file.width} × ${file.height} px`;
  if (minRes) {
    // Exactly the minimum passes; one pixel short on either side fails.
    const shortWidth = Math.max(0, minRes.width - file.width);
    const shortHeight = Math.max(0, minRes.height - file.height);
    const ok = shortWidth === 0 && shortHeight === 0;
    const shortfall = [shortWidth && `${shortWidth} px too narrow`, shortHeight && `${shortHeight} px too short`].filter(Boolean).join(" and ");
    checks.push({
      id: "resolution-min",
      label: "Minimum resolution",
      basis: "verified",
      status: ok ? "pass" : "fail",
      measured: ok ? dims : `${dims} (${shortfall})`,
      requirement: `at least ${minRes.width} × ${minRes.height} px`,
      suggestion: ok
        ? undefined
        : "Use the original, uncompressed photo from your camera. Screenshots and messaging apps reduce resolution.",
    });
  }

  // The print ratio (mm) and pixel ratio can differ slightly; either is accepted.
  const ratios: number[] = [];
  const addRatio = (r: number | null | undefined) => {
    if (num(r) && r > 0 && !ratios.some((x) => Math.abs(x - r) < 0.002)) ratios.push(r);
  };
  addRatio(req.photo_spec?.aspect_ratio);
  if (digital.required_resolution_px) addRatio(digital.required_resolution_px.width / digital.required_resolution_px.height);
  if (digital.min_resolution_px) addRatio(digital.min_resolution_px.width / digital.min_resolution_px.height);
  if (ratios.length) {
    const actual = file.width / file.height;
    const deviation = Math.min(...ratios.map((r) => Math.abs(actual - r) / r));
    const status: CheckStatus =
      deviation <= ESTIMATE_TOLERANCE.aspectRatioPass ? "pass" : deviation <= ESTIMATE_TOLERANCE.aspectRatioWarn ? "warning" : "fail";
    checks.push({
      id: "aspect-ratio",
      label: "Shape (aspect ratio)",
      basis: "verified",
      status,
      measured: `${actual.toFixed(3)} (width ÷ height)`,
      requirement: ratios.map((r) => r.toFixed(3)).join(" or "),
      suggestion: status === "pass" ? undefined : "Crop the photo to the required shape. An uncropped phone photo is usually too wide or too tall.",
    });
  }

  /* ---------- AI estimates ---------- */

  const unavailable = (id: string, label: string, requirement: string | undefined, reason: string): PhotoCheck => ({
    id,
    label,
    basis: "estimate",
    status: "unavailable",
    requirement,
    detail: reason,
    suggestion: "Check this yourself against the requirement.",
  });

  const face = analysis.face;
  let geometry: Evaluation["geometry"] = null;
  let eyeBand: Evaluation["eyeBand"] = null;
  const faceReason = analysis.modelError
    ? analysis.modelError
    : analysis.faceCount === 0
      ? "No face was detected, so this couldn't be measured."
      : "Facial landmarks couldn't be located precisely.";

  if (analysis.faceCount !== null) {
    const count = analysis.faceCount;
    checks.push({
      id: "face-count",
      label: "One face, clearly visible",
      basis: "estimate",
      status: count === 1 && face ? "pass" : "fail",
      measured:
        count === 0
          ? "No face detected"
          : !face
            ? "Face found, but its features couldn't be located"
            : count > 1
            ? `${count} faces detected`
            : `1 face${analysis.detectionConfidence ? ` (${Math.round(analysis.detectionConfidence * 100)}% confidence)` : ""}`,
      requirement: "exactly one face",
      suggestion:
        count === 0 || !face
          ? "Face the camera directly with your whole face visible and evenly lit. Remove anything covering your face."
          : count > 1
            ? "Only you can be in the photo. Crop out or retake without other people, posters or reflections."
            : undefined,
    });
  } else {
    checks.push(unavailable("face-count", "One face, clearly visible", "exactly one face", faceReason));
  }

  const multiplier = num(req.auto_crop_config?.head_top_multiplier)
    ? req.auto_crop_config.head_top_multiplier
    : FALLBACK_HEAD_TOP_MULTIPLIER;
  if (face) {
    const crownY = face.chinY - (face.chinY - face.foreheadY) * multiplier;
    geometry = { crownY, chinY: face.chinY, eyeY: face.eyeY };
  }

  const headRange = framing.head_height_pct;
  if (hasBounds(headRange)) {
    if (geometry) {
      const value = (geometry.chinY - geometry.crownY) * 100;
      const { status, side } = rangeStatus(value, headRange, ESTIMATE_TOLERANCE.framingPct);
      checks.push({
        id: "head-height",
        label: "Head size (chin to crown)",
        basis: "estimate",
        status,
        measured: `${pct(value)} of photo height`,
        requirement: rangeText(headRange),
        detail: "Crown position is estimated from facial landmarks, as hair can hide it.",
        suggestion:
          side === "low"
            ? "Your head is too small in the frame. Crop closer, or stand nearer the camera."
            : side === "high"
              ? "Your head is too large in the frame. Crop wider, or step back from the camera."
              : undefined,
      });
    } else {
      checks.push(unavailable("head-height", "Head size (chin to crown)", rangeText(headRange), faceReason));
    }
  }

  const eyeRange = framing.eye_position?.from_bottom_pct;
  if (hasBounds(eyeRange)) {
    eyeBand = [1 - (num(eyeRange.max) ? eyeRange.max : 100) / 100, 1 - (num(eyeRange.min) ? eyeRange.min : 0) / 100];
    if (geometry) {
      const value = (1 - geometry.eyeY) * 100;
      const { status, side } = rangeStatus(value, eyeRange, ESTIMATE_TOLERANCE.framingPct);
      checks.push({
        id: "eye-position",
        label: "Eye height",
        basis: "estimate",
        status,
        measured: `${pct(value)} up from the bottom`,
        requirement: rangeText(eyeRange),
        suggestion:
          side === "low"
            ? "Your eyes sit too low. Leave less space above your head, or include a little more below your chin."
            : side === "high"
              ? "Your eyes sit too high. Leave more space above your head."
              : undefined,
      });
    } else {
      checks.push(unavailable("eye-position", "Eye height", rangeText(eyeRange), faceReason));
    }
  }

  const topRange = framing.top_margin_pct;
  if (topRange && num(topRange.min)) {
    if (geometry) {
      const value = geometry.crownY * 100;
      const { status } = rangeStatus(value, { min: topRange.min }, ESTIMATE_TOLERANCE.framingPct);
      checks.push({
        id: "top-margin",
        label: "Space above head",
        basis: "estimate",
        status,
        measured: value < 0 ? "Top of head is cut off" : pct(value),
        requirement: `${rangeText({ min: topRange.min })}${num(topRange.recommended) ? ` (ideally ${topRange.recommended}%)` : ""}`,
        suggestion: status === "pass" ? undefined : "Leave a clear gap between the top of your head and the edge of the photo.",
      });
    } else {
      checks.push(unavailable("top-margin", "Space above head", rangeText({ min: topRange.min }), faceReason));
    }
  }

  const chinRange = framing.chin_to_bottom_pct;
  if (hasBounds(chinRange)) {
    if (geometry) {
      const value = (1 - geometry.chinY) * 100;
      const { status, side } = rangeStatus(value, chinRange, ESTIMATE_TOLERANCE.framingPct);
      checks.push({
        id: "chin-margin",
        label: "Space below chin",
        basis: "estimate",
        status,
        measured: pct(value),
        requirement: rangeText(chinRange),
        suggestion:
          side === "low"
            ? "Include more of your neck and shoulders below your chin."
            : side === "high"
              ? "There's too much space below your chin. Crop a little tighter at the bottom."
              : undefined,
      });
    } else {
      checks.push(unavailable("chin-margin", "Space below chin", rangeText(chinRange), faceReason));
    }
  }

  if (pose.head_tilt_allowed === false) {
    if (face) {
      const roll = Math.abs(face.rollDeg);
      checks.push({
        id: "head-tilt",
        label: "Head level (not tilted)",
        basis: "estimate",
        status: thresholdStatus(roll, ESTIMATE_TOLERANCE.rollDeg),
        measured: `${roll.toFixed(1)}° tilt`,
        requirement: "no tilt",
        suggestion:
          roll >= ESTIMATE_TOLERANCE.rollDeg.warn
            ? "Keep your head straight, with both eyes level. Rotating the image won't fix a tilted head."
            : undefined,
      });
      const yaw = Math.abs(face.yawDeg);
      const pitch = Math.abs(face.pitchDeg);
      checks.push({
        id: "head-rotation",
        label: "Facing the camera",
        basis: "estimate",
        status: worst(thresholdStatus(yaw, ESTIMATE_TOLERANCE.yawDeg), thresholdStatus(pitch, ESTIMATE_TOLERANCE.pitchDeg)),
        measured: `${yaw.toFixed(0)}° turned, ${pitch.toFixed(0)}° up/down`,
        requirement: "face straight on",
        suggestion:
          yaw >= ESTIMATE_TOLERANCE.yawDeg.warn || pitch >= ESTIMATE_TOLERANCE.pitchDeg.warn
            ? "Look straight into the lens with the camera at eye level, and don't turn your head or chin."
            : undefined,
      });
    } else {
      checks.push(unavailable("head-tilt", "Head level (not tilted)", "no tilt", faceReason));
      checks.push(unavailable("head-rotation", "Facing the camera", "face straight on", faceReason));
    }
  }

  const bs = face?.blendshapes ?? {};
  const hasBlendshapes = Object.keys(bs).length > 0;

  if (pose.eyes_open === true) {
    if (face && hasBlendshapes) {
      const blink = Math.max(bs.eyeBlinkLeft ?? 0, bs.eyeBlinkRight ?? 0);
      const status = thresholdStatus(blink, ESTIMATE_TOLERANCE.eyeBlink);
      checks.push({
        id: "eyes-open",
        label: "Eyes open",
        basis: "estimate",
        status,
        measured: status === "pass" ? "Open" : status === "warning" ? "Possibly half-closed" : "Closed",
        requirement: "both eyes open",
        suggestion: status === "pass" ? undefined : "Keep both eyes fully open and look into the lens.",
      });
    } else {
      checks.push(unavailable("eyes-open", "Eyes open", "both eyes open", faceReason));
    }
  }

  if (pose.mouth_closed === true) {
    if (face && hasBlendshapes) {
      const status = worst(
        thresholdStatus(bs.jawOpen ?? 0, ESTIMATE_TOLERANCE.jawOpen),
        thresholdStatus(face.lipGapRatio, ESTIMATE_TOLERANCE.lipGapRatio),
      );
      checks.push({
        id: "mouth-closed",
        label: "Mouth closed",
        basis: "estimate",
        status,
        measured: status === "pass" ? "Closed" : status === "warning" ? "Slightly open" : "Open",
        requirement: "mouth closed",
        suggestion: status === "pass" ? undefined : "Close your mouth and relax your lips.",
      });
    } else {
      checks.push(unavailable("mouth-closed", "Mouth closed", "mouth closed", faceReason));
    }
  }

  const expression = pose.expression?.trim();
  if (expression) {
    const wantsNeutral = /neutral/i.test(expression) && !/smil/i.test(expression);
    if (!wantsNeutral) {
      checks.push({
        id: "expression",
        label: "Facial expression",
        basis: "manual",
        status: "manual",
        requirement: expression,
        suggestion: "Make sure your expression matches the requirement.",
      });
    } else if (face && hasBlendshapes) {
      const smile = ((bs.mouthSmileLeft ?? 0) + (bs.mouthSmileRight ?? 0)) / 2;
      const status = thresholdStatus(smile, ESTIMATE_TOLERANCE.smile);
      checks.push({
        id: "expression",
        label: "Neutral expression",
        basis: "estimate",
        status,
        measured: status === "pass" ? "Neutral" : status === "warning" ? "Slight smile" : "Smiling",
        requirement: expression,
        suggestion: status === "pass" ? undefined : "Relax your face, with no smile and your eyebrows in their natural position.",
      });
    } else {
      checks.push(unavailable("expression", "Neutral expression", expression, faceReason));
    }
  }

  const colourText = bgRules.color ?? digital.background_color;
  const bg = analysis.background;
  const backgroundSummary: Evaluation["background"] = colourText
    ? {
        requirement: colourText,
        required: parseColourSpecs(colourText),
        measuredRgb: bg?.meanRgb ?? null,
        measuredLabel: bg ? describeColour(bg) : null,
      }
    : null;
  const bgReason = "Not enough plain background was visible to measure it.";
  if (colourText) {
    const specs = parseColourSpecs(colourText);
    if (!specs.length) {
      checks.push({
        id: "background-colour",
        label: "Background colour",
        basis: "manual",
        status: "manual",
        requirement: colourText,
        suggestion: "Compare your background with the required colour yourself.",
      });
    } else if (bg) {
      const violation = Math.min(...specs.map((s) => colourViolation(bg, s)));
      const status: CheckStatus = violation === 0 ? "pass" : violation <= ESTIMATE_TOLERANCE.colourViolation ? "warning" : "fail";
      checks.push({
        id: "background-colour",
        label: "Background colour",
        basis: "estimate",
        status,
        measured: `Looks ${describeColour(bg)}`,
        requirement: colourText,
        detail: `Lightness ${bg.lightness.toFixed(0)}/100, colour saturation ${bg.chroma.toFixed(0)} (CIELAB).`,
        suggestion:
          status === "pass"
            ? undefined
            : `Stand in front of a plain ${specs.map((s) => s.label).join(" or ")} wall, with even light so it doesn't look grey or tinted.`,
      });
    } else {
      checks.push(unavailable("background-colour", "Background colour", colourText, bgReason));
    }
  }

  if (bgRules.shadows_allowed === false) {
    if (bg) {
      const status = worst(
        thresholdStatus(bg.shadowDepth, ESTIMATE_TOLERANCE.shadowDepth),
        thresholdStatus(bg.unevenness, ESTIMATE_TOLERANCE.unevenness),
      );
      checks.push({
        id: "background-shadows",
        label: "No shadows on background",
        basis: "estimate",
        status,
        measured: status === "pass" ? "Evenly lit" : status === "warning" ? "Slightly uneven lighting" : "Shadows or uneven lighting",
        requirement: "no shadows",
        suggestion:
          status === "pass"
            ? undefined
            : "Step a little away from the wall and light it evenly from the front. Avoid a single side lamp or window.",
      });
    } else {
      checks.push(unavailable("background-shadows", "No shadows on background", "no shadows", bgReason));
    }
  }

  if (bgRules.texture_allowed === false) {
    if (bg) {
      const status = thresholdStatus(bg.texture, ESTIMATE_TOLERANCE.texture);
      checks.push({
        id: "background-plain",
        label: "Plain background (no pattern)",
        basis: "estimate",
        status,
        measured: status === "pass" ? "Plain" : status === "warning" ? "Some texture" : "Patterned or textured",
        requirement: "plain, no texture or objects",
        suggestion: status === "pass" ? undefined : "Use a smooth, plain wall with no patterns, furniture or objects behind you.",
      });
    } else {
      checks.push(unavailable("background-plain", "Plain background (no pattern)", "plain background", bgReason));
    }
  }

  /* ---------- Manual review ---------- */

  if (pose.both_ears_visible === true) {
    checks.push({
      id: "ears-visible",
      label: "Both ears visible",
      basis: "manual",
      status: "manual",
      requirement: "both ears visible",
      suggestion: "Tuck your hair behind your ears so both are clearly visible.",
    });
  }

  const graded = checks.map((c) => c.status);
  // Something we couldn't measure is never a clean pass.
  const verdict = graded.includes("fail")
    ? "fail"
    : graded.includes("warning") || graded.includes("unavailable")
      ? "warning"
      : "pass";
  return { checks, verdict, geometry, eyeBand, background: backgroundSummary };
}

/* ========================================================================== */
/* Presentation helpers                                                       */
/* ========================================================================== */

const STATUS_META: Record<CheckStatus, { label: string; Icon: LucideIcon; text: string; badge: string }> = {
  pass: { label: "Pass", Icon: CircleCheck, text: "text-success", badge: "badge-success" },
  warning: { label: "Warning", Icon: TriangleAlert, text: "text-warning", badge: "badge-warning" },
  fail: { label: "Fail", Icon: CircleX, text: "text-error", badge: "badge-error" },
  manual: { label: "Check yourself", Icon: CircleQuestionMark, text: "text-info", badge: "badge-info" },
  unavailable: { label: "Not measured", Icon: CircleHelp, text: "text-base-content/60", badge: "badge-ghost" },
};

const BASIS_META: Record<CheckBasis, { title: string; tag: string; Icon: LucideIcon; blurb: string }> = {
  verified: {
    title: "Verified measurements",
    tag: "Exact",
    Icon: Ruler,
    blurb: "Read directly from your file, so these are exact.",
  },
  estimate: {
    title: "AI estimates",
    tag: "AI estimate",
    Icon: Cpu,
    blurb: "From on-device computer vision. Usually within a few percent; borderline readings show as warnings.",
  },
  manual: {
    title: "Manual review",
    tag: "Check yourself",
    Icon: ClipboardCheck,
    blurb: "Software can't judge these reliably. Check them yourself.",
  },
};

const STAGE_TEXT: Record<AnalysisStage, string> = {
  decoding: "Reading your image…",
  models: "Loading on-device AI (first check only, about 16 MB)…",
  face: "Finding your face and landmarks…",
  background: "Checking the background colour…",
};

const FIX_STEPS = [
  "Uploading your photo securely…",
  "Detecting face and eye line…",
  "Cropping to the official size…",
  "Cleaning up the background…",
  "Preparing your preview…",
];

const VERDICT_META = {
  pass: {
    Icon: CircleCheck,
    title: "Looks good against the measurable rules",
    tone: "border-success/30 bg-success/5",
    text: "text-success",
  },
  warning: {
    Icon: TriangleAlert,
    title: "Nearly there. A few things to review",
    tone: "border-warning/40 bg-warning/5",
    text: "text-warning",
  },
  fail: {
    Icon: CircleX,
    title: "This photo doesn't meet the rules yet",
    tone: "border-error/30 bg-error/5",
    text: "text-error",
  },
} as const;

type TabId = "fix" | "all" | "rules";

function summariseRequirements(req: CountryRequirements): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [];
  const spec = req.photo_spec;
  if (spec && num(spec.width_mm) && num(spec.height_mm)) rows.push({ label: "Print size", value: `${spec.width_mm} × ${spec.height_mm} mm` });
  else if (spec && num(spec.width_in) && num(spec.height_in)) rows.push({ label: "Print size", value: `${spec.width_in} × ${spec.height_in} in` });
  const d = req.digital_requirements;
  const min = d?.min_resolution_px ?? d?.required_resolution_px;
  if (min) rows.push({ label: "Min. resolution", value: `${min.width} × ${min.height} px` });
  if (num(d?.max_file_size_kb)) {
    rows.push({ label: "Max. file size", value: d.max_file_size_kb >= 1024 ? `${(d.max_file_size_kb / 1024).toFixed(1).replace(/\.0$/, "")} MB` : `${d.max_file_size_kb} KB` });
  }
  if (d?.format?.length) rows.push({ label: "Format", value: [...new Set(d.format.map(normaliseFormat))].map(formatLabel).join(", ") });
  const colour = req.background_rules?.color ?? d?.background_color;
  if (colour) rows.push({ label: "Background", value: colour });
  const f = req.face_constraints;
  if (hasBounds(f?.head_height_pct)) rows.push({ label: "Head height", value: `${rangeText(f.head_height_pct)} of photo` });
  if (hasBounds(f?.eye_position?.from_bottom_pct)) rows.push({ label: "Eye line", value: `${rangeText(f.eye_position.from_bottom_pct)} from bottom` });
  if (req.pose_rules?.expression) rows.push({ label: "Expression", value: req.pose_rules.expression });
  return rows;
}

function cssColour(el: Element, token: string, fallback: string): string {
  return getComputedStyle(el).getPropertyValue(token).trim() || fallback;
}

function drawOverlay(canvas: HTMLCanvasElement, analysis: ImageAnalysis | null, evaluation: Evaluation | null) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  if (!analysis) return;

  const primary = cssColour(canvas, "--color-primary", "limegreen");
  const accent = cssColour(canvas, "--color-accent", "teal");
  const success = cssColour(canvas, "--color-success", "green");
  const warning = cssColour(canvas, "--color-warning", "orange");
  const error = cssColour(canvas, "--color-error", "red");
  const ink = cssColour(canvas, "--color-neutral", "black");
  const paper = cssColour(canvas, "--color-neutral-content", "white");
  const statusColour = (s?: CheckStatus) => (s === "fail" ? error : s === "warning" ? warning : s === "pass" ? success : accent);
  const unit = Math.max(1, W / 400);
  const fontSize = Math.max(11, Math.round(W / 34));

  const label = (text: string, x: number, y: number, colour: string) => {
    ctx.font = `600 ${fontSize}px ui-sans-serif, system-ui, sans-serif`;
    const pad = fontSize * 0.35;
    const tw = ctx.measureText(text).width;
    const bx = Math.min(Math.max(0, x), W - tw - pad * 2);
    const by = Math.min(Math.max(0, y - fontSize - pad * 2), H - fontSize - pad * 2);
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = ink;
    ctx.fillRect(bx, by, tw + pad * 2, fontSize + pad * 2);
    ctx.globalAlpha = 1;
    ctx.fillStyle = colour === ink ? paper : colour;
    ctx.textBaseline = "top";
    ctx.fillText(text, bx + pad, by + pad);
  };

  // Allowed eye band from the API.
  if (evaluation?.eyeBand) {
    const [top, bottom] = evaluation.eyeBand;
    ctx.globalAlpha = 0.14;
    ctx.fillStyle = success;
    ctx.fillRect(0, top * H, W, (bottom - top) * H);
    ctx.globalAlpha = 0.6;
    ctx.strokeStyle = success;
    ctx.lineWidth = unit;
    ctx.setLineDash([4 * unit, 4 * unit]);
    ctx.strokeRect(0, top * H, W, (bottom - top) * H);
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  }

  for (const box of analysis.detectorBoxes) {
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.5 * unit;
    ctx.strokeRect(box.x0 * W, box.y0 * H, (box.x1 - box.x0) * W, (box.y1 - box.y0) * H);
  }

  const face = analysis.face;
  if (face) {
    ctx.fillStyle = primary;
    ctx.globalAlpha = 0.75;
    const r = Math.max(0.8, unit * 0.9);
    for (const l of face.landmarks) {
      ctx.beginPath();
      ctx.arc(l.x * W, l.y * H, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  const g = evaluation?.geometry;
  if (face && g) {
    const statusOf = (id: string) => evaluation?.checks.find((c) => c.id === id)?.status;
    const x0 = Math.max(0, face.box.x0 - 0.08) * W;
    const x1 = Math.min(1, face.box.x1 + 0.08) * W;
    const line = (y: number, colour: string, dashed: boolean) => {
      ctx.strokeStyle = colour;
      ctx.lineWidth = 2 * unit;
      ctx.setLineDash(dashed ? [6 * unit, 4 * unit] : []);
      ctx.beginPath();
      ctx.moveTo(x0, y * H);
      ctx.lineTo(x1, y * H);
      ctx.stroke();
      ctx.setLineDash([]);
    };
    line(Math.max(0, g.crownY), statusColour(statusOf("top-margin")), true);
    line(g.chinY, statusColour(statusOf("chin-margin")), true);
    line(g.eyeY, statusColour(statusOf("eye-position")), false);

    // Head-height bracket on the left.
    const bx = Math.max(6 * unit, x0 - 10 * unit);
    ctx.strokeStyle = statusColour(statusOf("head-height"));
    ctx.lineWidth = 3 * unit;
    ctx.beginPath();
    ctx.moveTo(bx + 5 * unit, Math.max(0, g.crownY) * H);
    ctx.lineTo(bx, Math.max(0, g.crownY) * H);
    ctx.lineTo(bx, g.chinY * H);
    ctx.lineTo(bx + 5 * unit, g.chinY * H);
    ctx.stroke();

    label("Crown (est.)", x1 - W * 0.3, Math.max(0, g.crownY) * H, ink);
    label("Eyes", x1 - W * 0.14, g.eyeY * H, ink);
    label("Chin", x1 - W * 0.14, g.chinY * H + fontSize * 1.8, ink);
  }
}

/* ========================================================================== */
/* Small internal view helpers                                                */
/* ========================================================================== */

function StatusIcon({ status, className = "h-4 w-4" }: { status: CheckStatus; className?: string }) {
  const { Icon, text, label } = STATUS_META[status];
  return <Icon className={`shrink-0 ${text} ${className}`} aria-label={label} role="img" />;
}

function BasisTag({ basis }: { basis: CheckBasis }) {
  const { Icon, tag, blurb } = BASIS_META[basis];
  return (
    <span className="badge badge-ghost badge-xs gap-1 whitespace-nowrap font-medium" title={blurb}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {tag}
    </span>
  );
}

/** One row in the "To fix" list: what we found, what's required, how to fix it. */
function CheckRow({ check }: { check: PhotoCheck }) {
  return (
    <li className="flex gap-2.5 py-2.5">
      <StatusIcon status={check.status} className="mt-0.5 h-4 w-4" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-sm font-semibold">{check.label}</span>
          <BasisTag basis={check.basis} />
        </div>
        <p className="mt-0.5 text-xs text-base-content/70">
          {check.measured && (
            <>
              <span className="font-medium text-base-content">{check.measured}</span>
              {check.requirement && " · "}
            </>
          )}
          {check.requirement && <>needs {check.requirement}</>}
        </p>
        {check.suggestion && (
          <p className="mt-1 flex items-start gap-1.5 text-xs font-medium">
            <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-accent" aria-hidden="true" />
            <span>{check.suggestion}</span>
          </p>
        )}
      </div>
    </li>
  );
}

/** Compact tile used in the "All checks" grid. */
function CheckTile({ check }: { check: PhotoCheck }) {
  const summary = check.measured ?? check.requirement ?? "";
  const hint = [check.measured && `Found: ${check.measured}`, check.requirement && `Required: ${check.requirement}`, check.detail, check.status !== "pass" ? check.suggestion : undefined]
    .filter(Boolean)
    .join("\n");
  return (
    <li className="flex items-start gap-2 rounded-lg border border-base-300 bg-base-100 px-2.5 py-2" title={hint}>
      <StatusIcon status={check.status} className="mt-0.5 h-4 w-4" />
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold">{check.label}</p>
        <p className="truncate text-xs text-base-content/65">{summary}</p>
      </div>
    </li>
  );
}

function RulesList({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
      {rows.map((row) => (
        <div key={row.label} className="min-w-0">
          <dt className="text-xs text-base-content/60">{row.label}</dt>
          <dd className="truncate font-semibold first-letter:uppercase" title={row.value}>
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Swatch({ colour, label, caption }: { colour: string | null; label: string; caption: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span
        className="h-9 w-9 shrink-0 rounded-lg border border-base-300 shadow-inner"
        style={colour ? { backgroundColor: colour } : undefined}
        aria-hidden="true"
      />
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-base-content/60">{label}</p>
        <p className="truncate text-xs font-semibold first-letter:uppercase">{caption}</p>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* Component                                                                  */
/* ========================================================================== */

type CountriesState =
  | { status: "loading" }
  | { status: "ready"; list: CountrySummary[] }
  | { status: "error"; error: string };

type RequirementsState = { key: string; data?: CountryRequirements; error?: string };

type FixState = { status: "idle" } | { status: "working"; step: number } | { status: "error"; message: string };

const messageOf = (err: unknown, fallback: string) =>
  err instanceof CheckerError ? err.message : fallback;

export default function PassportPhotoChecker({
  defaultCountryCode = PASSPORT_PHOTO_CHECKER_DEFAULTS.defaultCountryCode,
  defaultDocumentType = PASSPORT_PHOTO_CHECKER_DEFAULTS.defaultDocumentType,
  heading = PASSPORT_PHOTO_CHECKER_DEFAULTS.heading,
  description = PASSPORT_PHOTO_CHECKER_DEFAULTS.description,
  headingLevel = PASSPORT_PHOTO_CHECKER_DEFAULTS.headingLevel,
  enableAutoFix = PASSPORT_PHOTO_CHECKER_DEFAULTS.enableAutoFix,
  fixPhotoLabel = PASSPORT_PHOTO_CHECKER_DEFAULTS.fixPhotoLabel,
  className = "",
  onReport,
}: PassportPhotoCheckerProps) {
  const uid = useId();
  const router = useRouter();
  const Heading = headingLevel;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const tabRefs = useRef<Partial<Record<TabId, HTMLButtonElement | null>>>({});
  const runIdRef = useRef(0);
  const retainedModelsRef = useRef(false);

  /* ---------- Country & document selection ---------- */

  const [countriesState, setCountriesState] = useState<CountriesState>({ status: "loading" });
  const [countriesReload, setCountriesReload] = useState(0);
  const [selection, setSelection] = useState({ code: defaultCountryCode, documentType: defaultDocumentType });
  const [prevDefaults, setPrevDefaults] = useState({ defaultCountryCode, defaultDocumentType });
  if (prevDefaults.defaultCountryCode !== defaultCountryCode || prevDefaults.defaultDocumentType !== defaultDocumentType) {
    setPrevDefaults({ defaultCountryCode, defaultDocumentType });
    setSelection({ code: defaultCountryCode, documentType: defaultDocumentType });
  }

  useEffect(() => {
    let active = true;
    loadCountries().then(
      (list) => active && setCountriesState({ status: "ready", list }),
      (err) => active && setCountriesState({ status: "error", error: messageOf(err, "Couldn't load the country list.") }),
    );
    return () => {
      active = false;
    };
  }, [countriesReload]);

  const countryOptions = useMemo(() => {
    if (countriesState.status !== "ready") return [];
    const byCode = new Map<string, CountrySummary>();
    for (const c of countriesState.list) if (!byCode.has(c.country_code)) byCode.set(c.country_code, c);
    return [...byCode.values()];
  }, [countriesState]);

  const documentTypes = useMemo(
    () =>
      countriesState.status === "ready"
        ? countriesState.list.filter((c) => c.country_code === selection.code).map((c) => c.document_type)
        : [],
    [countriesState, selection.code],
  );

  const [requirementsState, setRequirementsState] = useState<RequirementsState | null>(null);
  const [requirementsReload, setRequirementsReload] = useState(0);
  const requirementsKey = `${selection.code}|${selection.documentType}|${requirementsReload}`;
  const requirementsLoading = requirementsState?.key !== requirementsKey;
  const requirements = !requirementsLoading ? requirementsState?.data ?? null : null;
  const requirementsError = !requirementsLoading ? requirementsState?.error ?? null : null;

  useEffect(() => {
    let active = true;
    const key = `${selection.code}|${selection.documentType}|${requirementsReload}`;
    loadRequirements(selection.code, selection.documentType).then(
      (data) => active && setRequirementsState({ key, data }),
      (err) => active && setRequirementsState({ key, error: messageOf(err, "Couldn't load the photo requirements.") }),
    );
    return () => {
      active = false;
    };
  }, [selection.code, selection.documentType, requirementsReload]);

  const handleCountryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const types = countriesState.status === "ready" ? countriesState.list.filter((c) => c.country_code === code).map((c) => c.document_type) : [];
    setSelection((prev) => ({
      code,
      documentType: types.includes(prev.documentType) ? prev.documentType : types.includes(defaultDocumentType) ? defaultDocumentType : types[0] ?? defaultDocumentType,
    }));
    setFixState({ status: "idle" });
  };

  /* ---------- Image & analysis ---------- */

  const [image, setImage] = useState<{ file: File; url: string } | null>(null);
  const [previewSize, setPreviewSize] = useState<{ width: number; height: number } | null>(null);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [analysis, setAnalysis] = useState<ImageAnalysis | null>(null);
  const [stage, setStage] = useState<AnalysisStage | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [tab, setTab] = useState<TabId | null>(null);
  const [fixState, setFixState] = useState<FixState>({ status: "idle" });
  const isFixing = fixState.status === "working";

  useEffect(() => {
    if (!image) return;
    return () => URL.revokeObjectURL(image.url);
  }, [image]);

  useEffect(
    () => () => {
      runIdRef.current += 1; // drop results from any in-flight analysis
      if (retainedModelsRef.current) {
        retainedModelsRef.current = false;
        releaseVisionModels();
      }
    },
    [],
  );

  const handleFile = useCallback(async (file: File) => {
    const runId = ++runIdRef.current;
    setAnalysis(null);
    setPreviewSize(null);
    setPreviewFailed(false);
    setAnalysisError(null);
    setTab(null);
    setFixState({ status: "idle" });

    const looksLikeImage = file.type.startsWith("image/") || /\.(jpe?g|png|webp|gif|bmp|heic|heif|avif)$/i.test(file.name);
    if (!looksLikeImage) {
      setImage(null);
      setAnalysisError("That file isn't an image. Please upload a JPEG, PNG or WebP photo.");
      return;
    }
    setImage({ file, url: URL.createObjectURL(file) });

    if (!retainedModelsRef.current) {
      retainedModelsRef.current = true;
      retainVisionModels();
    }
    try {
      const result = await analysePhoto(file, (s) => {
        if (runIdRef.current === runId) setStage(s);
      });
      if (runIdRef.current === runId) setAnalysis(result);
    } catch (err) {
      if (runIdRef.current === runId) setAnalysisError(messageOf(err, "Something went wrong while analysing this photo. Please try another image."));
    } finally {
      if (runIdRef.current === runId) setStage(null);
    }
  }, []);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
    e.target.value = ""; // allow re-selecting the same file
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (isFixing) return;
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    if (!isDragging) setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setIsDragging(false);
  };

  const openPicker = () => fileInputRef.current?.click();
  const onDropzoneKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPicker();
    }
  };

  const reset = () => {
    runIdRef.current += 1;
    setImage(null);
    setAnalysis(null);
    setPreviewSize(null);
    setPreviewFailed(false);
    setAnalysisError(null);
    setStage(null);
    setTab(null);
    setFixState({ status: "idle" });
  };

  /* ---------- Evaluation & report ---------- */

  const evaluation = useMemo(
    () => (analysis && requirements ? evaluatePhoto(analysis, requirements) : null),
    [analysis, requirements],
  );

  const report = useMemo<PassportPhotoReport | null>(
    () =>
      evaluation && requirements
        ? {
            countryCode: requirements.country.code,
            countryName: requirements.country.name,
            documentType: requirements.document_type,
            verdict: evaluation.verdict,
            checks: evaluation.checks,
            requirements,
          }
        : null,
    [evaluation, requirements],
  );

  // Keep the latest callback in a ref so an inline `onReport` can't re-trigger the effect.
  const onReportRef = useRef(onReport);
  useEffect(() => {
    onReportRef.current = onReport;
  });
  useEffect(() => {
    if (report) onReportRef.current?.(report);
  }, [report]);

  useEffect(() => {
    const canvas = overlayRef.current;
    if (canvas) drawOverlay(canvas, showLandmarks ? analysis : null, showLandmarks ? evaluation : null);
  }, [analysis, evaluation, showLandmarks, previewSize, previewFailed]);

  const { issues, toReview, counts } = useMemo(() => {
    const c: Record<CheckStatus, number> = { pass: 0, warning: 0, fail: 0, manual: 0, unavailable: 0 };
    const all = evaluation?.checks ?? [];
    for (const check of all) c[check.status]++;
    const rank = (s: CheckStatus) => (s === "fail" ? 0 : 1);
    return {
      issues: all.filter((x) => x.status === "fail" || x.status === "warning").sort((a, b) => rank(a.status) - rank(b.status)),
      toReview: all.filter((x) => x.status === "manual" || x.status === "unavailable"),
      counts: c,
    };
  }, [evaluation]);

  const groupedChecks = useMemo(() => {
    const groups: Record<CheckBasis, PhotoCheck[]> = { verified: [], estimate: [], manual: [] };
    for (const c of evaluation?.checks ?? []) groups[c.basis].push(c);
    return groups;
  }, [evaluation]);

  const requirementRows = useMemo(() => (requirements ? summariseRequirements(requirements) : []), [requirements]);
  const isAnalysing = stage !== null;
  const graded = counts.pass + counts.warning + counts.fail;
  const overlayWidth = 800;
  const overlayHeight = previewSize ? Math.round((overlayWidth * previewSize.height) / previewSize.width) : 1000;

  const tabs: { id: TabId; label: string }[] = evaluation
    ? [
        { id: "fix", label: `To fix (${issues.length})` },
        { id: "all", label: `All checks (${evaluation.checks.length})` },
        { id: "rules", label: "Rules" },
      ]
    : [];
  const activeTab: TabId = tab ?? (issues.length || toReview.length ? "fix" : "all");

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const i = tabs.findIndex((t) => t.id === activeTab);
    const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    setTab(next.id);
    tabRefs.current[next.id]?.focus();
  };

  /* ---------- Auto-fix: reuse the uploaded photo ---------- */

  const handleAutoFix = async () => {
    if (!image || !requirements || isFixing) return;
    setFixState({ status: "working", step: 0 });
    const ticker = setInterval(() => {
      setFixState((s) => (s.status === "working" ? { status: "working", step: Math.min(s.step + 1, FIX_STEPS.length - 1) } : s));
    }, 2200);
    try {
      const upload = await compressImageTo3MB(image.file).then((r) => r.file, () => image.file);
      const originalPreview = await readFileAsDataUrl(upload).catch(() => null);
      const result = await requestPhotoProcessing(upload, requirements.country.code, requirements.document_type);
      const size = requirements.digital_requirements?.required_resolution_px ?? requirements.digital_requirements?.min_resolution_px;
      const resultId = saveProcessedResult(result, {
        countryCode: requirements.country.code,
        countryName: requirements.country.name,
        documentType: requirements.document_type,
        targetDimensions: size ? `${size.width}x${size.height}` : undefined,
        originalPreview,
      });
      router.push(`/preview/${resultId}`);
    } catch (err) {
      setFixState({
        status: "error",
        message: err instanceof Error && err.message ? err.message : "We couldn't process your photo. Please try again.",
      });
    } finally {
      clearInterval(ticker);
    }
  };

  /* ---------- Render ---------- */

  const verdict = evaluation ? VERDICT_META[evaluation.verdict] : null;
  const bgSummary = evaluation?.background ?? null;
  const bgCheck = evaluation?.checks.find((c) => c.id === "background-colour");
  const bgExtras = evaluation?.checks.filter((c) => c.id === "background-shadows" || c.id === "background-plain") ?? [];

  return (
    <section
      className={`rounded-box border border-base-300 bg-base-100 text-base-content shadow-sm ${className}`}
      aria-labelledby={`${uid}-heading`}
    >
      {/* ---------------- Header: title + country ---------------- */}
      <header className="flex flex-col gap-3 border-b border-base-300 px-4 py-3 sm:px-5 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
            <ScanFace className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <Heading id={`${uid}-heading`} className="!text-lg font-extrabold leading-tight tracking-tight">
              {heading}
            </Heading>
            <p className="line-clamp-2 text-xs text-base-content/70 md:line-clamp-1">{description}</p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <label className="sr-only" htmlFor={`${uid}-country`}>
            Country
          </label>
          <select
            id={`${uid}-country`}
            className="select select-sm w-full md:w-56"
            value={selection.code}
            onChange={handleCountryChange}
            disabled={countriesState.status !== "ready" || isFixing}
          >
            {countriesState.status !== "ready" && <option value={selection.code}>{countriesState.status === "loading" ? "Loading countries…" : selection.code}</option>}
            {countriesState.status === "ready" && !countryOptions.some((c) => c.country_code === selection.code) && (
              <option value={selection.code}>{selection.code}</option>
            )}
            {countryOptions.map((c) => (
              <option key={c.country_code} value={c.country_code}>
                {c.country_name}
              </option>
            ))}
          </select>
          {documentTypes.length > 1 && (
            <>
              <label className="sr-only" htmlFor={`${uid}-doctype`}>
                Document
              </label>
              <select
                id={`${uid}-doctype`}
                className="select select-sm w-36 capitalize"
                value={selection.documentType}
                onChange={(e) => setSelection((prev) => ({ ...prev, documentType: e.target.value }))}
                disabled={isFixing}
              >
                {documentTypes.map((t) => (
                  <option key={t} value={t}>
                    {t.replace(/[_-]+/g, " ")}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      </header>

      {countriesState.status === "error" && (
        <div role="alert" className="alert alert-error alert-soft mx-4 mt-3 py-2 text-sm sm:mx-5">
          <CircleX className="h-4 w-4" aria-hidden="true" />
          <span>{countriesState.error}</span>
          <button
            type="button"
            className="btn btn-xs"
            onClick={() => {
              setCountriesState({ status: "loading" });
              setCountriesReload((n) => n + 1);
            }}
          >
            <RefreshCw className="h-3 w-3" aria-hidden="true" /> Retry
          </button>
        </div>
      )}

      <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-6">
        {/* ---------------- Left: upload / preview ---------------- */}
        <div
          className="flex min-w-0 flex-col gap-3"
          onDragOver={onDragOver}
          onDragEnter={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <input
            ref={fileInputRef}
            id={`${uid}-file`}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onInputChange}
            aria-describedby={`${uid}-privacy`}
            tabIndex={-1}
          />

          {!image ? (
            <div
              role="button"
              tabIndex={0}
              aria-label="Upload a photo to check. Drag and drop or press Enter to browse."
              onClick={openPicker}
              onKeyDown={onDropzoneKey}
              className={`flex min-h-72 cursor-pointer flex-col items-center justify-center gap-2.5 rounded-box border-2 border-dashed p-6 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                isDragging ? "border-primary bg-primary/5" : "border-base-300 bg-base-200 hover:border-primary/60"
              }`}
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary" aria-hidden="true">
                <ImagePlus className="h-6 w-6" />
              </span>
              <span className="text-base font-bold">{isDragging ? "Drop your photo here" : "Drag & drop your photo"}</span>
              <span className="btn btn-primary btn-sm pointer-events-none">Choose a photo</span>
              <span className="text-xs text-base-content/60">JPEG, PNG or WebP · the photo you plan to submit</span>
            </div>
          ) : (
            <figure className="flex flex-col gap-2">
              <div
                className={`relative mx-auto w-full max-w-[13rem] overflow-hidden rounded-box border bg-base-200 sm:max-w-[19rem] ${isDragging ? "border-primary ring-2 ring-primary" : "border-base-300"}`}
                style={previewSize ? { aspectRatio: `${previewSize.width} / ${previewSize.height}` } : undefined}
              >
                {previewFailed ? (
                  <div className="flex min-h-48 items-center justify-center p-6 text-center text-sm text-base-content/70">
                    Preview not available for this file.
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element -- local blob preview; next/image can't optimise object URLs
                  <img
                    src={image.url}
                    alt="Your uploaded photo"
                    className="block h-full w-full object-contain"
                    onLoad={(e) => setPreviewSize({ width: e.currentTarget.naturalWidth, height: e.currentTarget.naturalHeight })}
                    onError={() => setPreviewFailed(true)}
                  />
                )}
                <canvas
                  ref={overlayRef}
                  width={overlayWidth}
                  height={overlayHeight}
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  aria-hidden="true"
                />
                {(isAnalysing || isFixing) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-base-100/75 p-4 text-center backdrop-blur-[1px]">
                    <span className="loading loading-spinner loading-lg text-primary" aria-hidden="true" />
                    <span className="text-xs font-semibold">
                      {isFixing && fixState.status === "working" ? FIX_STEPS[fixState.step] : stage ? STAGE_TEXT[stage] : ""}
                    </span>
                  </div>
                )}
              </div>
              <figcaption className="flex flex-wrap items-center justify-center gap-1">
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  onClick={() => setShowLandmarks((v) => !v)}
                  aria-pressed={showLandmarks}
                  disabled={!analysis?.face && !analysis?.detectorBoxes.length}
                >
                  {showLandmarks ? <EyeOff className="h-3.5 w-3.5" aria-hidden="true" /> : <Eye className="h-3.5 w-3.5" aria-hidden="true" />}
                  {showLandmarks ? "Hide guides" : "Show guides"}
                </button>
                <button type="button" className="btn btn-ghost btn-xs" onClick={openPicker} disabled={isAnalysing || isFixing}>
                  <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" /> Another photo
                </button>
                <button type="button" className="btn btn-ghost btn-xs" onClick={reset} disabled={isFixing}>
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Start over
                </button>
              </figcaption>
              {showLandmarks && evaluation?.eyeBand && analysis?.face && (
                <p className="hidden text-center text-[11px] text-base-content/60 sm:block">
                  Green band: where your eyes should be · dashed lines: crown (est.) and chin
                </p>
              )}
            </figure>
          )}

          <p id={`${uid}-privacy`} className="flex items-start gap-1.5 text-[11px] leading-relaxed text-base-content/60">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
            <span>The check runs on your device; your photo isn&rsquo;t uploaded unless you choose to fix it.</span>
          </p>
        </div>

        {/* ---------------- Right: verdict, background, results ---------------- */}
        <div className="flex min-w-0 flex-col gap-3" aria-busy={isAnalysing || requirementsLoading}>
          {requirementsLoading && (
            <div role="status" className="flex items-center gap-2 rounded-box bg-base-200 p-3 text-sm">
              <span className="loading loading-spinner loading-sm text-primary" aria-hidden="true" />
              Loading photo requirements…
            </div>
          )}

          {requirementsError && (
            <div role="alert" className="alert alert-error alert-soft py-2 text-sm">
              <CircleX className="h-4 w-4" aria-hidden="true" />
              <span>{requirementsError}</span>
              <button type="button" className="btn btn-xs" onClick={() => setRequirementsReload((n) => n + 1)}>
                <RefreshCw className="h-3 w-3" aria-hidden="true" /> Retry
              </button>
            </div>
          )}

          {analysisError && (
            <div role="alert" className="alert alert-error alert-soft py-2 text-sm">
              <CircleX className="h-4 w-4" aria-hidden="true" />
              <span>{analysisError}</span>
            </div>
          )}

          {analysis?.modelError && (
            <div role="alert" className="alert alert-warning alert-soft py-2 text-sm">
              <TriangleAlert className="h-4 w-4" aria-hidden="true" />
              <span>{analysis.modelError} File checks are still exact.</span>
            </div>
          )}

          {/* Before a result: what will be checked */}
          {requirements && !evaluation && (
            <div className="rounded-box border border-base-300 bg-base-200 p-4">
              <h3 className="!text-sm font-bold">
                {requirements.country.name} {requirements.document_type} photo rules
              </h3>
              <p className="mb-3 text-xs text-base-content/60">
                {isAnalysing ? "Checking your photo against these rules…" : "Upload a photo and we’ll check it against these rules."}
              </p>
              <RulesList rows={requirementRows} />
            </div>
          )}

          {evaluation && requirements && verdict && (
            <>
              {/* Verdict */}
              <div role="status" className={`flex flex-wrap items-center gap-x-4 gap-y-3 rounded-box border p-3 sm:p-4 ${verdict.tone}`}>
                <div
                  className={`radial-progress shrink-0 bg-base-100 text-xs font-bold ${verdict.text}`}
                  style={{ "--value": graded ? Math.round((counts.pass / graded) * 100) : 0, "--size": "3.5rem", "--thickness": "5px" } as CSSProperties}
                  role="img"
                  aria-label={`${counts.pass} of ${graded} measured checks passed`}
                >
                  {counts.pass}/{graded}
                </div>
                <div className="min-w-0 flex-1 basis-48">
                  <p className="flex items-center gap-1.5 font-bold leading-snug">
                    <verdict.Icon className={`h-4 w-4 shrink-0 ${verdict.text}`} aria-hidden="true" />
                    {verdict.title}
                  </p>
                  <p className="mt-0.5 text-xs text-base-content/70">
                    {[
                      `${requirements.country.name} ${requirements.document_type}`,
                      counts.fail && `${counts.fail} failed`,
                      counts.warning && `${counts.warning} warning${counts.warning === 1 ? "" : "s"}`,
                      counts.manual + counts.unavailable && `${counts.manual + counts.unavailable} to check yourself`,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                {enableAutoFix && (
                  <button
                    type="button"
                    className={`btn btn-sm ${evaluation.verdict === "pass" ? "btn-outline btn-primary" : "btn-primary"} w-full sm:w-auto`}
                    onClick={handleAutoFix}
                    disabled={isFixing || isAnalysing}
                  >
                    {isFixing ? (
                      <span className="loading loading-spinner loading-xs" aria-hidden="true" />
                    ) : (
                      <Wand2 className="h-4 w-4" aria-hidden="true" />
                    )}
                    {isFixing ? "Fixing your photo…" : evaluation.verdict === "pass" ? "Make it print-ready" : fixPhotoLabel}
                  </button>
                )}
                {fixState.status === "working" && (
                  <p className="w-full text-xs text-base-content/70" aria-live="polite">
                    Using the photo you already uploaded. {FIX_STEPS[fixState.step]}
                  </p>
                )}
                {fixState.status === "error" && (
                  <p role="alert" className="flex w-full items-start gap-1.5 text-xs font-medium text-error">
                    <CircleX className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    {fixState.message}
                  </p>
                )}
              </div>

              {/* Background colour */}
              {bgSummary && (
                <div className="rounded-box border border-base-300 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="!text-sm font-bold">Background colour</h3>
                    {bgCheck && <span className={`badge badge-soft badge-sm ${STATUS_META[bgCheck.status].badge}`}>{STATUS_META[bgCheck.status].label}</span>}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
                    <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <Swatch
                      colour={bgSummary.measuredRgb ? `rgb(${bgSummary.measuredRgb.join(" ")})` : null}
                      label="Your background"
                      caption={bgSummary.measuredLabel ? `Looks ${bgSummary.measuredLabel}` : "Couldn't measure"}
                    />
                    <ArrowRight className="h-4 w-4 shrink-0 text-base-content/40" aria-hidden="true" />
                    {bgSummary.required.length ? (
                      bgSummary.required.map((spec) => <Swatch key={spec.label} colour={spec.swatch} label="Required" caption={spec.label} />)
                    ) : (
                      <Swatch colour={null} label="Required" caption={bgSummary.requirement} />
                    )}
                    </div>
                    {bgExtras.length > 0 && (
                      <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs sm:ml-auto">
                        {bgExtras.map((c) => (
                          <li key={c.id} className="flex items-center gap-1" title={c.suggestion}>
                            <StatusIcon status={c.status} className="h-3.5 w-3.5" />
                            {c.id === "background-shadows" ? "No shadows" : "Plain, no pattern"}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {/* Results tabs */}
              <div>
                <div role="tablist" aria-label="Check results" className="tabs tabs-box tabs-sm">
                  {tabs.map((t) => (
                    <button
                      key={t.id}
                      ref={(el) => {
                        tabRefs.current[t.id] = el;
                      }}
                      type="button"
                      role="tab"
                      id={`${uid}-tab-${t.id}`}
                      aria-selected={activeTab === t.id}
                      aria-controls={`${uid}-panel`}
                      tabIndex={activeTab === t.id ? 0 : -1}
                      className={`tab ${activeTab === t.id ? "tab-active" : ""}`}
                      onClick={() => setTab(t.id)}
                      onKeyDown={onTabKey}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <div
                  role="tabpanel"
                  id={`${uid}-panel`}
                  aria-labelledby={`${uid}-tab-${activeTab}`}
                  tabIndex={0}
                  className="mt-2 rounded-box focus-visible:outline-2 focus-visible:outline-primary lg:max-h-[19rem] lg:overflow-y-auto lg:pr-1"
                >
                  {activeTab === "fix" && (
                    <>
                      {issues.length ? (
                        <ul className="divide-y divide-base-300">
                          {issues.map((c) => (
                            <CheckRow key={c.id} check={c} />
                          ))}
                        </ul>
                      ) : (
                        <p className="flex items-center gap-2 py-2 text-sm text-success">
                          <CircleCheck className="h-4 w-4" aria-hidden="true" /> Nothing to fix in the measurable rules.
                        </p>
                      )}
                      {toReview.length > 0 && (
                        <>
                          <h3 className="mt-3 !text-xs font-bold uppercase tracking-wide text-base-content/60">Check these yourself</h3>
                          <ul className="divide-y divide-base-300">
                            {toReview.map((c) => (
                              <CheckRow key={c.id} check={c} />
                            ))}
                          </ul>
                        </>
                      )}
                    </>
                  )}

                  {activeTab === "all" && (
                    <div className="flex flex-col gap-3">
                      {(Object.keys(BASIS_META) as CheckBasis[]).map((basis) => {
                        const list = groupedChecks[basis];
                        if (!list.length) return null;
                        const { title, Icon, blurb } = BASIS_META[basis];
                        return (
                          <section key={basis} aria-labelledby={`${uid}-${basis}`}>
                            <h3 id={`${uid}-${basis}`} className="flex items-center gap-1.5 !text-xs font-bold">
                              <Icon className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                              {title}
                              <span className="font-normal text-base-content/60">· {blurb}</span>
                            </h3>
                            <ul className="mt-1.5 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                              {list.map((c) => (
                                <CheckTile key={c.id} check={c} />
                              ))}
                            </ul>
                          </section>
                        );
                      })}
                    </div>
                  )}

                  {activeTab === "rules" && (
                    <div className="py-1">
                      <RulesList rows={requirementRows} />
                    </div>
                  )}
                </div>
              </div>

              <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-base-content/55">
                <Info className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                A guide, not an official decision. Glare on glasses, hair over the face and skin lighting aren&rsquo;t fully assessed.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
