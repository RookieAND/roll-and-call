import { BADGE_ROLE, type BadgeRole } from "./badge-ladder";
import { kstMonthKey } from "./kst-month-key";
import type { MonthlyAppearance } from "./monthly-winners";

// 그 달 역할별 1위 한 명(포인트제용). 점수가 같으면 그 점수에 먼저 도달한 사람(마지막 기록 시각이 빠른 쪽)이 앞선다.
// 점수가 0 이하인 사람은 뺀다. 경쟁 상대가 없으면(점수가 있는 사람이 한 명뿐) 1위로 보지 않아 null이다.
export function monthLeader({
  appearances,
  role,
  month,
}: {
  appearances: MonthlyAppearance[];
  role: BadgeRole;
  month: string;
}): string | null {
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
  return ranked.length >= 2 ? ranked[0]![0] : null;
}

export const LEADER_ROLES: BadgeRole[] = [BADGE_ROLE.gm, BADGE_ROLE.player];
