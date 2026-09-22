import "server-only";
import { availabilities, db, games, participants } from "@roll-and-call/database";
import { and, eq, sql } from "drizzle-orm";

import { PARTICIPANT_STATUS } from "@/shared/lib";

export async function getResponseCountsByGm(gmId: string): Promise<Map<string, number>> {
  const rows = await db
    .select({
      gameId: availabilities.gameId,
      count: sql<number>`count(distinct ${availabilities.userId})::int`,
    })
    .from(availabilities)
    .innerJoin(
      participants,
      and(
        eq(participants.gameId, availabilities.gameId),
        eq(participants.userId, availabilities.userId),
        eq(participants.status, PARTICIPANT_STATUS.confirmed),
      ),
    )
    .innerJoin(games, eq(games.id, availabilities.gameId))
    .where(eq(games.gmId, gmId))
    .groupBy(availabilities.gameId);
  return new Map(rows.map((row) => [row.gameId, Number(row.count)]));
}
