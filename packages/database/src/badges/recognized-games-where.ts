import { and, exists, isNotNull, isNull, sql } from "drizzle-orm";

import { games, participants } from "../schema";

// 인정 세션 가운데 DB가 거를 수 있는 조건. 끝났는지는 playMinutes를 더해 isRecognizedSession이 마저 본다.
export const recognizedGamesWhere = and(
  isNotNull(games.confirmedAt),
  isNotNull(games.attendanceConfirmedAt),
  isNull(games.hiddenAt),
  exists(
    sql`(select 1 from ${participants} where ${participants.gameId} = ${games.id} and ${participants.status} = 'confirmed')`,
  ),
)!;
