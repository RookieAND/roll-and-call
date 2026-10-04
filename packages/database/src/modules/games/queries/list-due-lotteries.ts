import { and, asc, eq, gt, isNull, lte, not, or } from "drizzle-orm";

import { db } from "#/client";
import { RECRUIT_METHOD } from "#/modules/games/model/recruit-method";
import { SCHEDULE_MODE } from "#/modules/games/model/schedule-mode";
import { games } from "#/schema";

// 마감 때 추첨 크론이 집는 글: 마감이 지났는데 아직 추첨하지 않은 추첨 글(games_lottery_due_idx).
// 신청이 닫힌 글(isApplicationClosed)은 추첨할 수 없어 고르지 않고 stuck으로 개수만 센다.
export async function listDueLotteries({ now, limit = 50 }: { now: Date; limit?: number }) {
  const dueWhere = and(
    eq(games.recruitMethod, RECRUIT_METHOD.lottery),
    isNull(games.drawnAt),
    isNull(games.cancelledAt),
    lte(games.endDate, now),
  );
  const applicationOpen = or(
    isNull(games.confirmedAt),
    and(eq(games.scheduleMode, SCHEDULE_MODE.fixed), gt(games.confirmedAt, now)),
  );
  const [due, stuck] = await Promise.all([
    db
      .select({ id: games.id, serverId: games.serverId })
      .from(games)
      .where(and(dueWhere, applicationOpen))
      .orderBy(asc(games.endDate))
      .limit(limit),
    db.$count(games, and(dueWhere, not(applicationOpen!))),
  ]);
  return { due, stuck };
}
