import { and, eq, gt, inArray, lte, sql } from "drizzle-orm";

import { db } from "#db/client";
import { availabilities, gameRounds, games } from "#db/schema";

export const ROUND_AVAILABILITY_RETENTION_DAYS = 30;

// 다회차 구인에서 출석이 확정된 지 30일이 지난 회차의 가능 시간을 지운다. 단발 구인은 건드리지 않는다.
// 크론이 매시 부른다. 30일 되는 순간부터 지운다(29일은 남는다).
export async function purgeRoundAvailabilities({ now }: { now: Date }): Promise<number> {
  const cutoff = new Date(now.getTime() - ROUND_AVAILABILITY_RETENTION_DAYS * 24 * 60 * 60 * 1000);
  const deleted = await db
    .delete(availabilities)
    .where(
      inArray(
        sql`(${availabilities.gameId}, ${availabilities.roundNo})`,
        db
          .select({ gameId: gameRounds.gameId, roundNo: gameRounds.roundNo })
          .from(gameRounds)
          .innerJoin(games, eq(games.id, gameRounds.gameId))
          .where(and(gt(games.roundCount, 1), lte(gameRounds.attendanceConfirmedAt, cutoff))),
      ),
    )
    .returning({ gameId: availabilities.gameId });
  return deleted.length;
}
