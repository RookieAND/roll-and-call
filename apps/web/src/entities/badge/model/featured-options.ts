import type { BadgeView } from "./badge-view";
import { featuredEntry } from "./featured-entry";
import { resolveFeaturedEntry } from "./resolve-featured-entry";

// 받은 뱃지마다 받은 단계 전부(높은 단계부터)를 대표로 고를 수 있다.
export function featuredOptions<
  View extends BadgeView & { record: { categoryName: string | null } },
>(held: View[]): { entry: string; badge: View }[] {
  return held.flatMap((badge) =>
    Array.from({ length: badge.tier }, (_, index) => {
      const entry = featuredEntry({
        key: badge.key,
        tier: badge.tier - index,
        heldTier: badge.tier,
      });
      const resolved = resolveFeaturedEntry(entry, [badge]);
      return resolved ? [{ entry, badge: resolved }] : [];
    }).flat(),
  );
}
