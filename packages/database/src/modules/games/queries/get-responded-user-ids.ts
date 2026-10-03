import { and, eq } from "drizzle-orm";

import { db } from "#/client";
import { availabilities } from "#/schema";

export async function getRespondedUserIds({
  serverId,
  gameId,
}: {
  serverId: string;
  gameId: string;
}): Promise<string[]> {
  const rows = await db
    .selectDistinct({ userId: availabilities.userId })
    .from(availabilities)
    .where(and(eq(availabilities.serverId, serverId), eq(availabilities.gameId, gameId)));
  return rows.map((row) => row.userId);
}
