import { kstMonthKey, type BadgeRole, type MonthlyAppearance } from "@roll-and-call/database/rules";

export function currentMonthStanding(
  appearances: MonthlyAppearance[],
  userId: string,
  role: BadgeRole,
  now: Date,
) {
  const month = kstMonthKey(now);
  const counts = new Map<string, number>();
  for (const appearance of appearances) {
    if (appearance.role !== role || kstMonthKey(appearance.startsAt) !== month) continue;
    counts.set(appearance.userId, (counts.get(appearance.userId) ?? 0) + 1);
  }
  const count = counts.get(userId) ?? 0;
  const rank =
    count > 0 ? new Set([...counts.values()].filter((other) => other > count)).size + 1 : null;
  return { count, rank };
}
