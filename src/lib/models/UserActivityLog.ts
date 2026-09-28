/**
 * User Activity Log — tracks user events for analytics and debugging
 */

import { type Collection, type Db } from "mongodb";
import { getDb } from "@/lib/db/mongodb";

export interface UserActivityLogDocument {
  paymentId?: string;
  sessionId?: string;
  email?: string;
  event: string;
  status: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const COLLECTION_NAME = "user_activity_logs";

let _ensured = false;

async function ensureIndexes(col: Collection<UserActivityLogDocument>) {
  if (_ensured) return;
  await col.createIndex({ paymentId: 1 }, { sparse: true });
  await col.createIndex({ email: 1 }, { sparse: true });
  await col.createIndex({ event: 1 });
  await col.createIndex({ createdAt: -1 });
  // TTL: auto-delete logs older than 90 days
  await col.createIndex({ createdAt: 1 }, { expireAfterSeconds: 90 * 86400 });
  _ensured = true;
}

export async function getActivityLogCollection(
  db?: Db
): Promise<Collection<UserActivityLogDocument>> {
  const database = db || (await getDb());
  const col = database.collection<UserActivityLogDocument>(COLLECTION_NAME);
  await ensureIndexes(col);
  return col;
}
