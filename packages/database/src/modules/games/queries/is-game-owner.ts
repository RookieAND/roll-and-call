import { and, eq } from "drizzle-orm";

import { db } from "../../../client";
import { games } from "../../../schema";

export async function isGameOwner({
  serverId,
  gameId,
  gmId,
}: {
  serverId: string;
  gameId: string;
  gmId: string;
}) {
  const [owned] = await db
    .select({ id: games.id })
    .from(games)
    .where(and(eq(games.serverId, serverId), eq(games.id, gameId), eq(games.gmId, gmId)));
  return Boolean(owned);
}
