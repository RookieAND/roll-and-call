import { and, asc, eq, gt, isNotNull, isNull, lte, or } from "drizzle-orm";

import { db } from "#/client";
import { RECRUIT_METHOD } from "#/modules/games/model/recruit-method";
import { games } from "#/schema";

// 마감 때 최소 인원 판정 크론이 집는 글: 마감이 지났는데 아직 판정하지 않은 선착순 글(games_min_players_due_idx).
// 시작한 세션은 취소할 수 없어 고르지 않는다. 추첨 글은 drawLottery가 판정한다.
export async function listDueMinPlayers({ now, limit = 50 }: { now: Date; limit?: number }) {
  return db
    .select({ id: games.id, serverId: games.serverId })
    .from(games)
    .where(
      and(
        eq(games.recruitMethod, RECRUIT_METHOD.firstCome),
        isNotNull(games.minPlayers),
        isNull(games.minPlayersJudgedAt),
        isNull(games.cancelledAt),
        lte(games.endDate, now),
        or(isNull(games.confirmedAt), gt(games.confirmedAt, now)),
      ),
    )
    .orderBy(asc(games.endDate))
    .limit(limit);
}
