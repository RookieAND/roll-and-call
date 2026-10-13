import { heldBadges } from "./held-badges";
import { pickFeaturedBadges } from "./pick-featured-badges";

interface PickRepresentativeBadgeParams<Record extends BadgeRecordLike> {
  featuredKeys: string[];
  showBadges: boolean;
  records: Record[];
  now: Date;
}

type BadgeRecordLike = { badgeKey: string; tier: number; categoryName: string | null };

// 대표 뱃지의 1번 칸(칭호). 업적 보이기를 껐으면 없다.
export function pickRepresentativeBadge<Record extends BadgeRecordLike>({
  featuredKeys,
  showBadges,
  records,
  now,
}: PickRepresentativeBadgeParams<Record>) {
  if (!showBadges) return null;
  const [first] = pickFeaturedBadges({ featuredKeys, held: heldBadges(records, now) });
  return first ?? null;
}
