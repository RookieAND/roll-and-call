import { and, exists, isNotNull, isNull, sql } from "drizzle-orm";

import { sessionEndAtSql } from "#db/modules/games/queries/session-end-at-sql";
import { games, participants } from "#db/schema";

// 인정 세션 조건. 출석을 일찍 확정해도 종료 판정 시각이 지나야 센다.
export const recognizedGamesWhere = and(
  isNotNull(games.confirmedAt),
  isNotNull(games.attendanceConfirmedAt),
  isNull(games.hiddenAt),
  isNull(games.cancelledAt),
  sql`${sessionEndAtSql} <= now()`,
  exists(
    sql`(select 1 from ${participants} where ${participants.gameId} = ${games.id} and ${participants.status} = 'confirmed')`,
  ),
)!;
