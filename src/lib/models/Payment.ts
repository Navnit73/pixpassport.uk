/**
 * Payment MongoDB Collection Schema & Helpers
 */

import { type Collection, type Db, ObjectId } from "mongodb";
import { getDb } from "@/lib/db/mongodb";

export interface PaymentImage {
  resultId: string;
  cloudinaryPublicId?: string;
  imageUrl?: string;
  previewUrl?: string;
  format?: string;
  dimensions?: string;
  sizeKb?: number;
}

export interface PaymentInvoice {
  invoiceNumber?: string;
  invoiceUrl?: string;
  invoicePdfUrl?: string;
  cloudinaryPublicId?: string;
  generatedAt?: Date;
  emailedAt?: Date;
}

export interface PaymentEmailDelivery {
  status: "pending" | "sending" | "sent" | "failed";
  resendEmailId?: string;
  attempts: number;
  lastError?: string;
  sentAt?: Date;
}

export type PaymentStatus =
  | "pending"
  | "authorized"
  | "paid"
  | "failed"
  | "refunded"
  | "cancelled";

export type FulfillmentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export interface PaymentDocument {
  _id?: ObjectId;

  /** Internal UUID for the payment */
  paymentId: string;
  email: string;

  /** Razorpay references */
  razorpayOrderId: string;
  razorpayPaymentId?: string;

  /** Amount in smallest currency unit (pence) */
  amount: number;
  currency: string;

  status: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;

  productType: string;
  planType?: "standard" | "expert_edit";
  expertReviewStatus?: "pending" | "in_review" | "completed";

  image: PaymentImage & {
    originalImageUrl?: string;
  };

  invoice: PaymentInvoice;

  emailDelivery: PaymentEmailDelivery;

  downloadToken?: string;
  downloadTokenExpiresAt?: Date;

  metadata: {
    userAgent?: string;
    ipHash?: string;
    sessionId?: string;
    countryCode?: string;
    countryName?: string;
    /** Visitor's geo-IP country used to pick the charged currency */
    geoCountry?: string;
    isExpertEdit?: boolean;
    originalPreviewUrl?: string;
  };

  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
}

const COLLECTION_NAME = "payments";

let _ensured = false;

/**
 * Create an index, tolerating a pre-existing index with the same name but different options
 * (Mongo codes 85 IndexOptionsConflict / 86 IndexKeySpecsConflict). The database is shared, so
 * an equivalent index may already exist; that must never take a request down.
 */
async function safeCreateIndex(
  col: Collection<PaymentDocument>,
  spec: Parameters<Collection<PaymentDocument>["createIndex"]>[0],
  options?: Parameters<Collection<PaymentDocument>["createIndex"]>[1]
) {
  try {
    await col.createIndex(spec, options);
  } catch (err) {
    const code = (err as { code?: number }).code;
    if (code === 85 || code === 86) {
      console.warn("[Payment] index already exists with different options, skipping:", JSON.stringify(spec));
      return;
    }
    throw err;
  }
}

async function ensureIndexes(col: Collection<PaymentDocument>) {
  if (_ensured) return;
  await safeCreateIndex(col, { paymentId: 1 }, { unique: true });
  // Matches the existing production index (partial, so documents without an order id are allowed)
  await safeCreateIndex(
    col,
    { razorpayOrderId: 1 },
    { unique: true, partialFilterExpression: { razorpayOrderId: { $type: "string" } } }
  );
  await safeCreateIndex(col, { email: 1 });
  await safeCreateIndex(col, { status: 1 });
  await safeCreateIndex(col, { createdAt: -1 });
  await safeCreateIndex(col, { "image.resultId": 1 });
  await safeCreateIndex(col, { downloadToken: 1 }, { sparse: true });
  _ensured = true;
}

export async function getPaymentCollection(
  db?: Db
): Promise<Collection<PaymentDocument>> {
  const database = db || (await getDb());
  const col = database.collection<PaymentDocument>(COLLECTION_NAME);
  await ensureIndexes(col);
  return col;
}
