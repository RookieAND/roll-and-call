import { and, eq, inArray, isNull } from "drizzle-orm";

import { db } from "#/client";
import { badgeKey } from "#/modules/badges/model/badge-key";
import { BADGE_LADDER, BADGE_ROLE, type BadgeRole } from "#/modules/badges/model/badge-ladder";
import { monthScoreboard } from "#/modules/badges/model/month-scoreboard";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";
import { profiles, userBadges } from "#/schema";

import { loadMonthlyAppearances } from "./load-monthly-appearances";

export type MonthlyWinner = {
  userId: string;
  nickname: string;
  score: number;
  sessionCount: number;
};

// 그 달 이달의 GM·PL을 받은 사람. 업적 보이기 설정과 상관없이 모두 넣는다(R6).
// 점수·세션 수는 이달의 뱃지를 정한 점수판(monthScoreboard)과 같은 기준이다.
export async function loadMonthlyWinners({
  serverId,
  month,
}: {
  serverId: string;
  month: string;
}): Promise<{ gm: MonthlyWinner[]; pl: MonthlyWinner[] }> {
  const gmKey = badgeKey({ ladder: BADGE_LADDER.gmMonthly, subject: month });
  const plKey = badgeKey({ ladder: BADGE_LADDER.playerMonthly, subject: month });
  const [holders, appearances] = await Promise.all([
    db
      .select({
        userId: userBadges.userId,
        badgeKey: userBadges.badgeKey,
        nickname: memberNicknameSql(serverId),
      })
      .from(userBadges)
      .innerJoin(profiles, eq(profiles.id, userBadges.userId))
      .where(
        and(
          eq(userBadges.serverId, serverId),
          inArray(userBadges.badgeKey, [gmKey, plKey]),
          isNull(userBadges.revokedAt),
        ),
      ),
    loadMonthlyAppearances({ serverId }),
  ]);
  const winnersOf = (key: string, role: BadgeRole) => {
    const board = monthScoreboard({ appearances, role, month });
    return holders
      .filter((holder) => holder.badgeKey === key)
      .flatMap((holder) => {
        const row = board.find((item) => item.userId === holder.userId);
        return row
          ? [
              {
                userId: holder.userId,
                nickname: holder.nickname,
                score: row.score,
                sessionCount: row.sessionCount,
              },
            ]
          : [];
      });
  };
  return { gm: winnersOf(gmKey, BADGE_ROLE.gm), pl: winnersOf(plKey, BADGE_ROLE.player) };
}
