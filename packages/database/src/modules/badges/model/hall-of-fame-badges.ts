import { groupBy, uniqBy } from "es-toolkit";

import type { EarnedBadge } from "./badge-facts";
import { BADGE_LADDER, HIDDEN_LADDER } from "./badge-ladder";
import { parseBadgeKey } from "./parse-badge-key";

type MonthlyWinner = EarnedBadge & { userId: string };

const HALL_OF_FAME_WINS = 3;

// 이달의 GM·PL을 통틀어 세 번 받은 사람마다 명예의 전당 하나. 세 번째로 받은 달이 근거다.
export function hallOfFameBadges(winners: MonthlyWinner[]): MonthlyWinner[] {
  const monthly = uniqBy(
    winners.filter((winner) => {
      const ladder = parseBadgeKey(winner.badgeKey)?.ladder;
      return ladder === BADGE_LADDER.gmMonthly || ladder === BADGE_LADDER.playerMonthly;
    }),
    (winner) => `${winner.userId}|${winner.badgeKey}`,
  );
  const byUser = new Map(Object.entries(groupBy(monthly, (winner) => winner.userId)));
  return [...byUser.entries()].flatMap(([userId, wins]) => {
    const third = wins.toSorted(
      (left, right) => left.earnedAt.getTime() - right.earnedAt.getTime(),
    )[HALL_OF_FAME_WINS - 1];
    return third
      ? [
          {
            userId,
            badgeKey: HIDDEN_LADDER.hallOfFame,
            tier: 1,
            earnedAt: third.earnedAt,
            sourceGameId: null,
          },
        ]
      : [];
  });
}
