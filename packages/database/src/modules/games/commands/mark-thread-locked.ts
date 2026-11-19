import { and, eq } from "drizzle-orm";

import { db } from "#db/client";
import { games } from "#db/schema";

export async function markThreadLocked({
  serverId,
  gameId,
  at,
}: {
  serverId: string;
  gameId: string;
  at: Date;
}) {
  await db
    .update(games)
    .set({ threadLockedAt: at })
    .where(and(eq(games.serverId, serverId), eq(games.id, gameId)));
}
