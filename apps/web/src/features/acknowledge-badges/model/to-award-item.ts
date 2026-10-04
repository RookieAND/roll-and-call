import { isNull } from "es-toolkit";

import { monthLabel } from "@/entities/badge";

import type { AwardItem } from "./award-sheet";
import type { HeldBadge } from "./held-badge";

export function toAwardItem(badge: HeldBadge): AwardItem {
  return {
    key: badge.key,
    emoji: badge.emoji,
    look: badge.look,
    name: badge.name,
    ribbon: isNull(badge.monthKey) ? null : monthLabel(badge.monthKey),
  };
}
