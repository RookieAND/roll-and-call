import { BADGE_ROLE, isHiddenLadder } from "@roll-and-call/database/badges/model";
import { isNull } from "es-toolkit";

import { monthLabel, TIER_NAME } from "@/entities/badge";

import type { HeldBadge } from "./held-badge";

export function awardTag(badge: HeldBadge): string {
  if (isHiddenLadder(badge.ladder)) return "숨겨진 칭호를 찾았습니다";
  if (!isNull(badge.monthKey)) {
    const rank = badge.role === BADGE_ROLE.gm ? "운영" : "참여";
    return `${monthLabel(badge.monthKey)} ${rank} 1위`;
  }
  if (badge.tier <= 1) return "새 뱃지";
  const particle = badge.grade === 5 ? "으로" : "로";
  return `${TIER_NAME[badge.grade]}${particle} 올랐습니다`;
}
