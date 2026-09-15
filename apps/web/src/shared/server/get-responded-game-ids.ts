import "server-only";
import { eq } from "drizzle-orm";

import { db } from "./db";
import { availabilities } from "./schema";

export async function getRespondedGameIds(userId: string): Promise<Set<string>> {
  const rows = await db
    .selectDistinct({ gameId: availabilities.gameId })
    .from(availabilities)
    .where(eq(availabilities.userId, userId));
  return new Set(rows.map((row) => row.gameId));
}
