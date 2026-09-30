import type { BadgeView } from "./badge-view";
import { FEATURED_BADGE_LIMIT } from "./featured-badge-limit";

// 고른 대표 뱃지를 고른 순서대로. 고른 것이 하나도 붙어 있지 않으면(기간이 끝난 이달의 뱃지 등) 최근에 받은 3개.
export function pickFeaturedBadges<View extends BadgeView>(
  featuredKeys: string[],
  held: View[],
): View[] {
  const picked = featuredKeys.flatMap((key) => held.filter((badge) => badge.key === key));
  return picked.length > 0 ? picked : held.slice(0, FEATURED_BADGE_LIMIT);
}
