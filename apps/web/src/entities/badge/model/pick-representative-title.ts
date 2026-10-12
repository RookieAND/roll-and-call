import { heldBadges } from "./held-badges";
import { pickFeaturedBadges } from "./pick-featured-badges";
import type { RepresentativeTitle } from "./representative-title";

interface PickRepresentativeTitleParams {
  featuredKeys: string[];
  showBadges: boolean;
  records: { badgeKey: string; tier: number; categoryName: string | null }[];
  now: Date;
}

export function pickRepresentativeTitle({
  featuredKeys,
  showBadges,
  records,
  now,
}: PickRepresentativeTitleParams): RepresentativeTitle | null {
  if (!showBadges) return null;
  const [first] = pickFeaturedBadges({ featuredKeys, held: heldBadges(records, now) });
  return first ? { emoji: first.emoji, name: first.name, look: first.look } : null;
}
