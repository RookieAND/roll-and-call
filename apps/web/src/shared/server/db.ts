import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

// prepare: false — required for Supabase's transaction-mode pooler.
// max: 1 — each serverless instance keeps one pooled connection (Supabase's serverless guidance).
const client = postgres(process.env.DATABASE_URL!, { prepare: false, max: 1 });

export const db = drizzle(client, { schema });
export * from "./schema";
