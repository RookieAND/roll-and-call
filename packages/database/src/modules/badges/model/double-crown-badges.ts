import type { EarnedBadge } from "./badge-facts";
import { BADGE_LADDER, HIDDEN_LADDER } from "./badge-ladder";
import { parseBadgeKey } from "./parse-badge-key";

type MonthlyWinner = EarnedBadge & { userId: string };

// 같은 달에 이달의 GM과 이달의 PL을 함께 받은 사람마다 더블 크라운 하나. 여러 번 겹쳐도 가장 이른 달 기준으로 한 번만 준다.
export function doubleCrownBadges(winners: MonthlyWinner[]): MonthlyWinner[] {
  const rolesByUserMonth = new Map<string, { winner: MonthlyWinner; gm: boolean; pl: boolean }>();
  for (const winner of winners) {
    const parsed = parseBadgeKey(winner.badgeKey);
    if (!parsed?.subject) continue;
    const isGm = parsed.ladder === BADGE_LADDER.gmMonthly;
    const isPl = parsed.ladder === BADGE_LADDER.playerMonthly;
    if (!isGm && !isPl) continue;
    const key = `${winner.userId}|${parsed.subject}`;
    const entry = rolesByUserMonth.get(key) ?? { winner, gm: false, pl: false };
    entry.gm ||= isGm;
    entry.pl ||= isPl;
    rolesByUserMonth.set(key, entry);
  }

  const earliest = new Map<string, MonthlyWinner>();
  for (const { winner, gm, pl } of rolesByUserMonth.values()) {
    if (!gm || !pl) continue;
    const current = earliest.get(winner.userId);
    if (!current || winner.earnedAt < current.earnedAt) earliest.set(winner.userId, winner);
  }
  return [...earliest.values()].map((winner) => ({
    userId: winner.userId,
    badgeKey: HIDDEN_LADDER.doubleCrown,
    tier: 1,
    earnedAt: winner.earnedAt,
    sourceGameId: null,
  }));
}
