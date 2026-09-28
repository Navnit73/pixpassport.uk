/**
 * Webhook Event — prevents duplicate processing of Razorpay webhooks
 */

import { type Collection, type Db } from "mongodb";
import { getDb } from "@/lib/db/mongodb";

export interface WebhookEventDocument {
  /** Razorpay event ID */
  eventId: string;
  eventType: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  status: "processing" | "processed" | "failed";
  metadata?: Record<string, unknown>;
  processedAt?: Date;
  createdAt: Date;
}

const COLLECTION_NAME = "webhook_events";

let _ensured = false;

async function ensureIndexes(col: Collection<WebhookEventDocument>) {
  if (_ensured) return;
  await col.createIndex({ eventId: 1 }, { unique: true });
  await col.createIndex({ razorpayOrderId: 1 }, { sparse: true });
  await col.createIndex({ createdAt: -1 });
  _ensured = true;
}

export async function getWebhookEventCollection(
  db?: Db
): Promise<Collection<WebhookEventDocument>> {
  const database = db || (await getDb());
  const col = database.collection<WebhookEventDocument>(COLLECTION_NAME);
  await ensureIndexes(col);
  return col;
}
