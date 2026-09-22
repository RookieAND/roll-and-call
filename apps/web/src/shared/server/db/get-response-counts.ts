import "server-only";
import { availabilities, db, participants } from "@trpg/database";
import { and, eq, inArray, sql } from "drizzle-orm";

import { PARTICIPANT_STATUS } from "@/shared/lib";

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
        eq(participants.status, PARTICIPANT_STATUS.confirmed),
      ),
    )
    .where(inArray(availabilities.gameId, gameIds))
    .groupBy(availabilities.gameId);
  return new Map(rows.map((row) => [row.gameId, Number(row.count)]));
}
