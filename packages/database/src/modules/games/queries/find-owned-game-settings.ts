import { and, eq } from "drizzle-orm";

import { db } from "../../../client";
import { games } from "../../../schema";

export async function findOwnedGameSettings({
  serverId,
  gameId,
  gmId,
}: {
  serverId: string;
  gameId: string;
  gmId: string;
}) {
  const [game] = await db
    .select({
      thumbnailUrl: games.thumbnailUrl,
      images: games.images,
      scheduleMode: games.scheduleMode,
      recruitMethod: games.recruitMethod,
    })
    .from(games)
    .where(and(eq(games.serverId, serverId), eq(games.id, gameId), eq(games.gmId, gmId)));
  return game;
}
