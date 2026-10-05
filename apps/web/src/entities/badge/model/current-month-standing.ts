import {
  kstMonthKey,
  type BadgeRole,
  type MonthlyAppearance,
} from "@roll-and-call/database/badges/model";

// 이번 달 내 횟수와 1위 횟수(R18). 이달의 GM·PL을 정하는 집계(recordAppearances)를 그대로 센다.
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
  return { count: counts.get(userId) ?? 0, topCount: Math.max(0, ...counts.values()) };
}
