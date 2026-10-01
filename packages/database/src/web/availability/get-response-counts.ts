import { and, eq, inArray, sql } from "drizzle-orm";

import { db } from "../../client";
import { PARTICIPANT_STATUS } from "../../rules";
import { availabilities, participants } from "../../schema";

export async function getResponseCounts({
  serverId,
  gameIds,
}: {
  serverId: string;
  gameIds: string[];
}): Promise<Map<string, number>> {
  if (gameIds.length === 0) return new Map();
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
    .where(and(eq(availabilities.serverId, serverId), inArray(availabilities.gameId, gameIds)))
    .groupBy(availabilities.gameId);
  return new Map(rows.map((row) => [row.gameId, Number(row.count)]));
}
