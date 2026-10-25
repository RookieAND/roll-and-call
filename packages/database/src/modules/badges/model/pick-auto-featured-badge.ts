import type { EarnedBadge } from "./badge-facts";
import { BADGE_LADDERS } from "./badge-ladders";
import { parseBadgeKey } from "./parse-badge-key";

// 지정한 대표 뱃지가 없는 사람이 새로 받은 칭호 가운데 대표로 올릴 하나. 이달의 GM·PL은 한 달만 붙으므로 뺀다.
// 등급이 가장 높은 것, 같으면 먼저 받은 것.
export function pickAutoFeaturedBadge(badges: EarnedBadge[]): string | null {
  const candidates = badges.flatMap((badge) => {
    const parsed = parseBadgeKey(badge.badgeKey);
    const definition = parsed && BADGE_LADDERS[parsed.ladder];
    const grade = definition?.steps[badge.tier - 1]?.grade;
    return definition && !definition.monthly && grade ? [{ badge, grade }] : [];
  });
  const [best] = candidates.toSorted(
    (left, right) =>
      right.grade - left.grade || left.badge.earnedAt.getTime() - right.badge.earnedAt.getTime(),
  );
  return best?.badge.badgeKey ?? null;
}
