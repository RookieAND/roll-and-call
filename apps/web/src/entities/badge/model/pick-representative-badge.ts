import { heldBadges } from "./held-badges";
import { pickFeaturedBadges } from "./pick-featured-badges";

interface PickRepresentativeBadgeParams<Record extends BadgeRecordLike> {
  featuredKeys: string[];
  records: Record[];
  now: Date;
}

type BadgeRecordLike = { badgeKey: string; tier: number; categoryName: string | null };

// 대표 뱃지의 1번 칸(칭호).
export function pickRepresentativeBadge<Record extends BadgeRecordLike>({
  featuredKeys,
  records,
  now,
}: PickRepresentativeBadgeParams<Record>) {
  const [first] = pickFeaturedBadges({ featuredKeys, held: heldBadges(records, now) });
  return first ?? null;
}
