import { and, eq } from "drizzle-orm";

import { db } from "#db/client";
import { games } from "#db/schema";

export async function findGameGmId({ serverId, gameId }: { serverId: string; gameId: string }) {
  const [game] = await db
    .select({ gmId: games.gmId })
    .from(games)
    .where(and(eq(games.serverId, serverId), eq(games.id, gameId)));
  return game?.gmId;
}
