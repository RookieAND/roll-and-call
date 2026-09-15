import "server-only";
import { eq } from "drizzle-orm";

import { db } from "./db";
import { availabilities } from "./schema";

export async function getRespondedUserIds(gameId: string): Promise<string[]> {
  const rows = await db
    .selectDistinct({ userId: availabilities.userId })
    .from(availabilities)
    .where(eq(availabilities.gameId, gameId));
  return rows.map((row) => row.userId);
}
