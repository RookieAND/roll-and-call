import "server-only";
import { availabilities, db, participants } from "@roll-and-call/database";
import { PARTICIPANT_STATUS } from "@roll-and-call/database/rules";
import { and, eq, inArray, sql } from "drizzle-orm";

export async function getResponseCounts(gameIds: string[]): Promise<Map<string, number>> {
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
        eq(participants.gameId, availabilities.gameId),
        eq(participants.userId, availabilities.userId),
        eq(participants.status, PARTICIPANT_STATUS.confirmed),
      ),
    )
    .where(inArray(availabilities.gameId, gameIds))
    .groupBy(availabilities.gameId);
  return new Map(rows.map((row) => [row.gameId, Number(row.count)]));
}
