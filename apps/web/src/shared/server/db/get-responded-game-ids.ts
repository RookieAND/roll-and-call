import "server-only";
import { availabilities, db } from "@trpg/database";
import { eq } from "drizzle-orm";

export async function getRespondedGameIds(userId: string): Promise<Set<string>> {
  const rows = await db
    .selectDistinct({ gameId: availabilities.gameId })
    .from(availabilities)
    .where(eq(availabilities.userId, userId));
  return new Set(rows.map((row) => row.gameId));
}
