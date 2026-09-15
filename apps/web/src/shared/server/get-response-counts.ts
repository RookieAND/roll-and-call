import "server-only";
import { and, eq, inArray, sql } from "drizzle-orm";

import { availabilities, db, participants } from "./db";

// 확정 참여자의 응답만 센다.
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
        eq(participants.status, "confirmed"),
      ),
    )
    .where(inArray(availabilities.gameId, gameIds))
    .groupBy(availabilities.gameId);
  return new Map(rows.map((row) => [row.gameId, Number(row.count)]));
}
