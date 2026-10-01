import { and, eq } from "drizzle-orm";

import { db } from "../../client";
import { games } from "../../schema";

export async function deleteOwnedGame({
  serverId,
  gameId,
  gmId,
}: {
  serverId: string;
  gameId: string;
  gmId: string;
}) {
  const [deleted] = await db
    .delete(games)
    .where(and(eq(games.serverId, serverId), eq(games.id, gameId), eq(games.gmId, gmId)))
    .returning();
  return deleted;
}
