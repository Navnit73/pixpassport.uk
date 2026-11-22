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

let _ensuring: Promise<void> | null = null;

function ensureIndexes(col: Collection<UserActivityLogDocument>): Promise<void> {
  if (_ensured) return Promise.resolve();
  // Parallel and non-fatal: logging indexes must never block or break a request
  _ensuring ??= Promise.all([
    col.createIndex({ paymentId: 1 }, { sparse: true }),
    col.createIndex({ email: 1 }, { sparse: true }),
    col.createIndex({ event: 1 }),
    col.createIndex({ createdAt: -1 }),
    // TTL: auto-delete logs older than 90 days
    col.createIndex({ createdAt: 1 }, { expireAfterSeconds: 90 * 86400 }),
  ]).then(
    () => {
      _ensured = true;
    },
    (err) => {
      console.warn("[UserActivityLog] index setup skipped:", err?.message || err);
      _ensured = true;
    }
  );
  return _ensuring;
}

export async function getActivityLogCollection(
  db?: Db
): Promise<Collection<UserActivityLogDocument>> {
  const database = db || (await getDb());
  const col = database.collection<UserActivityLogDocument>(COLLECTION_NAME);
  await ensureIndexes(col);
  return col;
}
