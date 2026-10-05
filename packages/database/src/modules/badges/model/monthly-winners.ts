import { uniq } from "es-toolkit";

import type { EarnedBadge } from "./badge-facts";
import { badgeKey } from "./badge-key";
import { BADGE_LADDER, BADGE_ROLE, type BadgeRole } from "./badge-ladder";
import { kstMonthKey } from "./kst-month-key";
import { monthScoreboard } from "./month-scoreboard";
import type { MonthlyAppearance } from "./monthly-appearance";
import { nextMonthStart } from "./next-month-start";

export type { MonthlyAppearance } from "./monthly-appearance";

// 끝난 달마다 역할별 1위. 동점이면 모두 받고, 0점 이하는 받지 않는다. 이번 달은 아직 끝나지 않아 뺀다.
export function monthlyWinners(
  appearances: MonthlyAppearance[],
  now: Date,
): (EarnedBadge & { userId: string })[] {
  const currentMonth = kstMonthKey(now);
  const months = uniq(appearances.map((appearance) => kstMonthKey(appearance.startsAt))).filter(
    (month) => month < currentMonth,
  );

  return months.flatMap((month) =>
    ([BADGE_ROLE.gm, BADGE_ROLE.player] as BadgeRole[]).flatMap((role) => {
      const ladder = role === BADGE_ROLE.gm ? BADGE_LADDER.gmMonthly : BADGE_LADDER.playerMonthly;
      return monthScoreboard({ appearances, role, month })
        .filter((row) => row.rank === 1)
        .map((row) => ({
          userId: row.userId,
          badgeKey: badgeKey({ ladder, subject: month }),
          tier: 1,
          earnedAt: nextMonthStart(month),
          sourceGameId: null,
        }));
    }),
  );
}
