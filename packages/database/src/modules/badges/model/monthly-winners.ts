import type { EarnedBadge } from "./badge-facts";
import { badgeKey } from "./badge-key";
import { BADGE_LADDER, BADGE_ROLE, type BadgeRole } from "./badge-ladder";
import { kstMonthKey } from "./kst-month-key";
import { nextMonthStart } from "./next-month-start";

export type MonthlyAppearance = {
  userId: string;
  role: BadgeRole;
  startsAt: Date;
  // 순위에 더하는 값. 참여 횟수제는 1, 포인트제는 점수(불참 감점은 음수)다.
  weight: number;
  // 세션으로 센 횟수. 후기 점수·불참 감점처럼 세션이 아닌 출연은 0이다.
  sessions: number;
};

// 끝난 달마다 역할별 1위. 동점이면 모두 받는다. 이번 달은 아직 끝나지 않아 뺀다.
// breakTies(포인트제)면 공동 1위를 두지 않고, 그 점수에 먼저 도달한 사람(마지막 기록 시각이 빠른 쪽) 한 명만 받는다.
export function monthlyWinners(
  appearances: MonthlyAppearance[],
  now: Date,
  { breakTies = false }: { breakTies?: boolean } = {},
): (EarnedBadge & { userId: string })[] {
  const currentMonth = kstMonthKey(now);
  const counts = new Map<string, Map<string, number>>();
  const reachedAt = new Map<string, number>();
  for (const appearance of appearances) {
    const month = kstMonthKey(appearance.startsAt);
    if (month >= currentMonth) continue;
    const group = `${appearance.role}|${month}`;
    const users = counts.get(group) ?? new Map<string, number>();
    users.set(appearance.userId, (users.get(appearance.userId) ?? 0) + appearance.weight);
    counts.set(group, users);
    const reachedKey = `${group}|${appearance.userId}`;
    reachedAt.set(
      reachedKey,
      Math.max(reachedAt.get(reachedKey) ?? 0, appearance.startsAt.getTime()),
    );
  }

  return [...counts].flatMap(([group, users]) => {
    const [role, month] = group.split("|") as [BadgeRole, string];
    const ladder = role === BADGE_ROLE.gm ? BADGE_LADDER.gmMonthly : BADGE_LADDER.playerMonthly;
    const top = Math.max(...users.values());
    if (top <= 0) return [];
    const tied = [...users].filter(([, count]) => count === top);
    const winners = breakTies
      ? tied
          .toSorted(
            ([leftId], [rightId]) =>
              reachedAt.get(`${group}|${leftId}`)! - reachedAt.get(`${group}|${rightId}`)! ||
              leftId.localeCompare(rightId),
          )
          .slice(0, 1)
      : tied;
    return winners.map(([userId]) => ({
      userId,
      badgeKey: badgeKey({ ladder, subject: month }),
      tier: 1,
      earnedAt: nextMonthStart(month),
      sourceGameId: null,
    }));
  });
}
