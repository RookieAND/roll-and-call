import type { BadgeView } from "./badge-view";
import { FEATURED_BADGE_LIMIT } from "./featured-badge-limit";

export function pickFeaturedBadges<View extends BadgeView>({
  featuredKeys,
  held,
}: {
  featuredKeys: string[];
  held: View[];
}): View[] {
  const picked = featuredKeys.flatMap((key) => held.filter((badge) => badge.key === key));
  return picked.length > 0 ? picked : held.slice(0, FEATURED_BADGE_LIMIT);
}
