import { sumBy, uniq } from "es-toolkit";

import type { BadgeRole } from "./badge-ladder";
import { kstMonthKey } from "./kst-month-key";
import type { MonthlyAppearance } from "./monthly-appearance";

export type ScoreboardRow = { userId: string; score: number; sessionCount: number; rank: number };

// 그 달 그 역할의 점수판. 순위를 매기는 유일한 곳이다(홈·도감·뱃지·월간 발표).
// 점수 내림차순이고 동점은 같은 순위, 다음 점수대가 다음 순위다. 0점 이하는 넣지 않는다.
export function monthScoreboard({
  appearances,
  role,
  month,
}: {
  appearances: MonthlyAppearance[];
  role: BadgeRole;
  month: string;
}): ScoreboardRow[] {
  const byUser = new Map<string, MonthlyAppearance[]>();
  for (const appearance of appearances) {
    if (appearance.role !== role || kstMonthKey(appearance.startsAt) !== month) continue;
    byUser.set(appearance.userId, [...(byUser.get(appearance.userId) ?? []), appearance]);
  }
  const rows = [...byUser].map(([userId, items]) => ({
    userId,
    score: sumBy(items, (item) => item.score),
    sessionCount: sumBy(items, (item) => item.sessions),
  }));
  const sorted = rows.filter((row) => row.score > 0).toSorted((a, b) => b.score - a.score);
  const scores = uniq(sorted.map((row) => row.score));
  return sorted.map((row) => ({ ...row, rank: scores.indexOf(row.score) + 1 }));
}
