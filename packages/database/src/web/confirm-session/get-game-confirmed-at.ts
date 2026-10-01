import { and, eq } from "drizzle-orm";

import { db } from "../../client";
import { games } from "../../schema";

export async function getGameConfirmedAt({
  serverId,
  gameId,
}: {
  serverId: string;
  gameId: string;
}) {
  const [game] = await db
    .select({ confirmedAt: games.confirmedAt })
    .from(games)
    .where(and(eq(games.serverId, serverId), eq(games.id, gameId)));
  return game?.confirmedAt ?? null;
}
