import { isHiddenLadder } from "@roll-and-call/database/badges/model";
import { isNull } from "es-toolkit";

import { BADGE_TONE, badgeRequirement, lookTone, monthLabel } from "@/entities/badge";

import type { AwardItem } from "./award-sheet";
import { awardTag } from "./award-tag";
import type { HeldBadge } from "./held-badge";

export function toAwardItem(badge: HeldBadge): AwardItem {
  const monthly = !isNull(badge.monthKey);
  const highlighted = monthly || badge.tier > 1 || isHiddenLadder(badge.ladder);
  return {
    key: badge.key,
    emoji: badge.emoji,
    look: badge.look,
    name: badge.name,
    ribbon: isNull(badge.monthKey) ? null : monthLabel(badge.monthKey),
    tag: awardTag(badge),
    tagTone: highlighted ? lookTone(badge.look) : BADGE_TONE.primary,
    requirement: badgeRequirement({
      ladder: badge.ladder,
      step: badge.step,
      categoryName: badge.categoryName,
    }),
  };
}
