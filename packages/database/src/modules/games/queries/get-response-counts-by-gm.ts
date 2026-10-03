import { and, eq, sql } from "drizzle-orm";

import { db } from "#/client";
import { PARTICIPANT_STATUS } from "#/modules/games/model/participant-status";
import { availabilities, games, participants } from "#/schema";

export async function getResponseCountsByGm({
  serverId,
  gmId,
}: {
  serverId: string;
  gmId: string;
}): Promise<Map<string, number>> {
  const rows = await db
    .select({
      gameId: availabilities.gameId,
      count: sql<number>`count(distinct ${availabilities.userId})::int`,
    })
    .from(availabilities)
    .innerJoin(
      participants,
      and(
        eq(participants.serverId, serverId),
        eq(participants.gameId, availabilities.gameId),
        eq(participants.userId, availabilities.userId),
        eq(participants.status, PARTICIPANT_STATUS.confirmed),
      ),
    )
    .innerJoin(games, and(eq(games.serverId, serverId), eq(games.id, availabilities.gameId)))
    .where(and(eq(availabilities.serverId, serverId), eq(games.gmId, gmId)))
    .groupBy(availabilities.gameId);
  return new Map(rows.map((row) => [row.gameId, Number(row.count)]));
}
