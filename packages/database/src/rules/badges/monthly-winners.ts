import type { EarnedBadge } from "./badge-facts";
import { badgeKey } from "./badge-key";
import { BADGE_LADDER, BADGE_ROLE, type BadgeRole } from "./badge-ladder";
import { kstMonthKey } from "./kst-month-key";
import { nextMonthStart } from "./next-month-start";

export type MonthlyAppearance = { userId: string; role: BadgeRole; startsAt: Date };

// 끝난 달마다 역할별 1위. 동점이면 모두 받는다. 이번 달은 아직 끝나지 않아 뺀다.
export function monthlyWinners(
  appearances: MonthlyAppearance[],
  now: Date,
): (EarnedBadge & { userId: string })[] {
  const currentMonth = kstMonthKey(now);
  const counts = new Map<string, Map<string, number>>();
  for (const appearance of appearances) {
    const month = kstMonthKey(appearance.startsAt);
    if (month >= currentMonth) continue;
    const group = `${appearance.role}|${month}`;
    const users = counts.get(group) ?? new Map<string, number>();
    users.set(appearance.userId, (users.get(appearance.userId) ?? 0) + 1);
    counts.set(group, users);
  }

  return [...counts].flatMap(([group, users]) => {
    const [role, month] = group.split("|") as [BadgeRole, string];
    const ladder = role === BADGE_ROLE.gm ? BADGE_LADDER.gmMonthly : BADGE_LADDER.playerMonthly;
    const top = Math.max(...users.values());
    return [...users]
      .filter(([, count]) => count === top)
      .map(([userId]) => ({
        userId,
        badgeKey: badgeKey(ladder, month),
        tier: 1,
        earnedAt: nextMonthStart(month),
        sourceGameId: null,
      }));
  });
}
