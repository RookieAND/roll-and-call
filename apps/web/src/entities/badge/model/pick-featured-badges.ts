import type { BadgeView } from "./badge-view";
import { FEATURED_BADGE_LIMIT } from "./featured-badge-limit";
import { resolveFeaturedEntry } from "./resolve-featured-entry";

export function pickFeaturedBadges<
  View extends BadgeView & { record: { categoryName: string | null } },
>({ featuredKeys, held }: { featuredKeys: string[]; held: View[] }): View[] {
  const picked = featuredKeys.flatMap((entry) => resolveFeaturedEntry(entry, held) ?? []);
  return picked.length > 0 ? picked : held.slice(0, FEATURED_BADGE_LIMIT);
}
