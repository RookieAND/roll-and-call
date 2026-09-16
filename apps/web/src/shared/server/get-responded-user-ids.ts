import "server-only";
import { availabilities, db } from "@trpg/database";
import { eq } from "drizzle-orm";

export async function getRespondedUserIds(gameId: string): Promise<string[]> {
  const rows = await db
    .selectDistinct({ userId: availabilities.userId })
    .from(availabilities)
    .where(eq(availabilities.gameId, gameId));
  return rows.map((row) => row.userId);
}
