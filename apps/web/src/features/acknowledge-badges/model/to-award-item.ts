import { BADGE_TONE, badgeRequirement, lookTone, monthLabel } from "@/entities/badge";

import type { AwardItem } from "./award-sheet";
import { awardTag } from "./award-tag";
import type { HeldBadge } from "./held-badge";

export function toAwardItem(badge: HeldBadge): AwardItem {
  const monthly = badge.monthKey !== null;
  const highlighted = monthly || badge.tier > 1;
  return {
    key: badge.key,
    emoji: badge.emoji,
    look: badge.look,
    name: badge.name,
    ribbon: badge.monthKey === null ? null : monthLabel(badge.monthKey),
    tag: awardTag(badge),
    tagTone: highlighted ? lookTone(badge.look) : BADGE_TONE.primary,
    requirement: badgeRequirement({
      ladder: badge.ladder,
      step: badge.step,
      categoryName: badge.categoryName,
    }),
  };
}
