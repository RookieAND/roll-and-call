import { eq } from "drizzle-orm";

import { db } from "#db/client";
import { miniRuleOf } from "#db/modules/badges/model/mini-rule-of";
import { type MonthlyAppearance } from "#db/modules/badges/model/monthly-winners";
import { recordAppearances } from "#db/modules/badges/model/record-appearances";
import { RANKING_MODE, type RankingMode } from "#db/modules/servers/model";
import { servers } from "#db/schema";

import { loadReviewAppearances } from "./load-review-appearances";

// ponytail: 끝난 세션을 한 번에 읽는다. 세션이 수만 건이 되면 달 단위 집계 쿼리로 바꾼다.
// 서버의 이 달의 기록 방식(ranking_mode)에 맞춰 센다. 포인트제는 후기 점수도 더한다.
export async function loadMonthlyAppearances({
  serverId,
  now = new Date(),
}: {
  serverId: string;
  now?: Date;
}): Promise<MonthlyAppearance[]> {
  const [server] = await db
    .select({ rankingMode: servers.rankingMode })
    .from(servers)
    .where(eq(servers.id, serverId));
  const mode = (server?.rankingMode ?? RANKING_MODE.count) as RankingMode;
  const rows = await db.query.games.findMany({
    columns: {
      id: true,
      gmId: true,
      confirmedAt: true,
      playMinutes: true,
      endedAt: true,
      hiddenAt: true,
      cancelledAt: true,
    },
    where: (game, { and, isNotNull, isNull }) =>
      and(
        eq(game.serverId, serverId),
        isNotNull(game.confirmedAt),
        isNull(game.hiddenAt),
        isNull(game.cancelledAt),
      ),
    with: {
      rulebook: { columns: {}, with: { category: { columns: { miniRule: true } } } },
      participants: {
        columns: { userId: true, status: true, absent: true, absenceCancelledAt: true },
        where: (participant) => eq(participant.serverId, serverId),
      },
    },
  });
  const games = rows.map(({ rulebook, ...game }) => ({
    ...game,
    miniRule: miniRuleOf({ rulebook }),
  }));
  const sessions = recordAppearances(games, now, { mode });
  if (mode !== RANKING_MODE.points) return sessions;
  return [...sessions, ...(await loadReviewAppearances({ serverId }))];
}
