import { and, eq, exists, isNotNull, isNull, sql } from "drizzle-orm";

import { db } from "#/client";
import { BADGE_ROLE } from "#/modules/badges/model/badge-ladder";
import { type MonthlyAppearance } from "#/modules/badges/model/monthly-winners";
import { isSessionEnded } from "#/modules/games/model/session-timing";
import { games, participants } from "#/schema";

import { attendedWhere } from "./attended-where";

// 홈의 이 달 기록과 같은 기준으로 센다. 끝난 세션이면 출석 확인 전이어도 넣고, 불참으로 적힌 사람만 뺀다.
const monthlyGamesWhere = and(
  isNotNull(games.confirmedAt),
  isNull(games.hiddenAt),
  isNull(games.cancelledAt),
  exists(
    sql`(select 1 from ${participants} where ${participants.gameId} = ${games.id} and ${participants.status} = 'confirmed')`,
  ),
)!;

// ponytail: 끝난 세션을 한 번에 읽는다. 세션이 수만 건이 되면 달 단위 집계 쿼리로 바꾼다.
export async function loadMonthlyAppearances({
  serverId,
  now = new Date(),
}: {
  serverId: string;
  now?: Date;
}): Promise<MonthlyAppearance[]> {
  const serverGamesWhere = and(eq(games.serverId, serverId), monthlyGamesWhere);
  const gameColumns = {
    confirmedAt: games.confirmedAt,
    playMinutes: games.playMinutes,
    endedAt: games.endedAt,
  };
  const [hosted, played] = await Promise.all([
    db
      .select({ userId: games.gmId, ...gameColumns })
      .from(games)
      .where(serverGamesWhere),
    db
      .select({ userId: participants.userId, ...gameColumns })
      .from(participants)
      .innerJoin(games, eq(games.id, participants.gameId))
      .where(and(attendedWhere, serverGamesWhere)),
  ]);
  const toAppearances = (rows: typeof hosted, role: MonthlyAppearance["role"]) =>
    rows
      .filter((row) => isSessionEnded(row, now))
      .map((row) => ({ userId: row.userId, role, startsAt: row.confirmedAt! }));
  return [...toAppearances(hosted, BADGE_ROLE.gm), ...toAppearances(played, BADGE_ROLE.player)];
}
