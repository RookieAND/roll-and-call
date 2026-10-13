import { BADGE_ROLE, type BadgeRole } from "./badge-ladder";
import { kstMonthKey } from "./kst-month-key";
import type { MonthlyAppearance } from "./monthly-winners";

// 그 달 역할별 1위. 값이 0 이하인 사람은 뺀다. 경쟁 상대가 없으면(값이 있는 사람이 한 명뿐) 1위로 보지 않아 빈 배열이다.
// 참여 횟수제(breakTies=false)는 동점이면 모두 공동 1위다.
// 포인트제(breakTies=true)는 공동 1위를 두지 않고, 그 점수에 먼저 도달한 사람(마지막 기록 시각이 빠른 쪽) 한 명만 고른다.
export function monthLeaders({
  appearances,
  role,
  month,
  breakTies = false,
}: {
  appearances: MonthlyAppearance[];
  role: BadgeRole;
  month: string;
  breakTies?: boolean;
}): string[] {
  const scores = new Map<string, { score: number; reachedAt: number }>();
  for (const appearance of appearances) {
    if (appearance.role !== role || kstMonthKey(appearance.startsAt) !== month) continue;
    const current = scores.get(appearance.userId) ?? { score: 0, reachedAt: 0 };
    scores.set(appearance.userId, {
      score: current.score + appearance.weight,
      reachedAt: Math.max(current.reachedAt, appearance.startsAt.getTime()),
    });
  }
  const ranked = [...scores]
    .filter(([, entry]) => entry.score > 0)
    .toSorted(
      ([leftId, left], [rightId, right]) =>
        right.score - left.score ||
        left.reachedAt - right.reachedAt ||
        leftId.localeCompare(rightId),
    );
  if (ranked.length < 2) return [];
  const top = ranked[0]![1].score;
  const tied = ranked.filter(([, entry]) => entry.score === top);
  return (breakTies ? tied.slice(0, 1) : tied).map(([userId]) => userId);
}

export const LEADER_ROLES: BadgeRole[] = [BADGE_ROLE.gm, BADGE_ROLE.player];
