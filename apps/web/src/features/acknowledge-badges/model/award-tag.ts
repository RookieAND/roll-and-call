import { BADGE_ROLE } from "@roll-and-call/database/badges/model";

import { monthLabel, TIER_NAME } from "@/entities/badge";

import type { HeldBadge } from "./held-badge";

export function awardTag(badge: HeldBadge): string {
  if (badge.monthKey !== null) {
    const rank = badge.role === BADGE_ROLE.gm ? "운영" : "참여";
    return `${monthLabel(badge.monthKey)} ${rank} 1위`;
  }
  if (badge.tier <= 1) return "새 뱃지";
  const particle = badge.grade === 5 ? "으로" : "로";
  return `${TIER_NAME[badge.grade]}${particle} 올랐습니다`;
}
