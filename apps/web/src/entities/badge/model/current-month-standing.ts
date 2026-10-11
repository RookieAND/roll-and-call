import {
  kstMonthKey,
  type BadgeRole,
  type MonthlyAppearance,
} from "@roll-and-call/database/badges/model";

// 이번 달 내 횟수(점수)와 순위, 1위 횟수(점수)(R18). 이달의 GM·PL을 정하는 집계(recordAppearances)를 그대로 센다.
export function currentMonthStanding({
  appearances,
  userId,
  role,
  now,
}: {
  appearances: MonthlyAppearance[];
  userId: string;
  role: BadgeRole;
  now: Date;
}) {
  const month = kstMonthKey(now);
  const counts = new Map<string, number>();
  for (const appearance of appearances) {
    if (appearance.role !== role || kstMonthKey(appearance.startsAt) !== month) continue;
    counts.set(appearance.userId, (counts.get(appearance.userId) ?? 0) + appearance.weight);
  }
  const count = counts.get(userId) ?? 0;
  // 0 이하는 순위에 오르지 못한다(포인트제에서 불참 점수가 더 클 때). rank는 높은 점수부터 매긴 순위다.
  const higher = [...counts.values()].filter((other) => other > count).length;
  return {
    count,
    topCount: Math.max(0, ...counts.values()),
    rank: count > 0 ? higher + 1 : null,
  };
}
