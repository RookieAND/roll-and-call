import { and, eq } from "drizzle-orm";

import { db } from "#/client";
import { availabilities } from "#/schema";

export async function getRespondedGameIds({
  serverId,
  userId,
}: {
  serverId: string;
  userId: string;
}): Promise<Set<string>> {
  const rows = await db
    .selectDistinct({ gameId: availabilities.gameId })
    .from(availabilities)
    .where(and(eq(availabilities.serverId, serverId), eq(availabilities.userId, userId)));
  return new Set(rows.map((row) => row.gameId));
}
