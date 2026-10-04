import {
  BADGE_LADDERS,
  type BadgeEvent,
  type BadgeLadderKey,
} from "@roll-and-call/database/badges/model";

import { stepLook } from "@/entities/badge";
import { buildLadderDetail, LADDER_META } from "@/features/view-badge";
import type { BadgeRecord } from "@/shared/server";

import type { DexMedal } from "./dex-medal";
import { heldRecord } from "./held-record";

export function ladderMedals({
  ladder,
  events,
  record,
}: {
  ladder: BadgeLadderKey;
  events: BadgeEvent[];
  record: BadgeRecord | undefined;
}): DexMedal[] {
  const held = heldRecord({ ladder, events, record });
  const heldTier = held?.tier ?? 0;
  const unit = LADDER_META[ladder].unit;
  return BADGE_LADDERS[ladder].steps.map((step, index) => ({
    key: `${ladder}-${index}`,
    emoji: step.emoji,
    look: stepLook(step),
    locked: index >= heldTier,
    name: step.name,
    caption: `${step.threshold}${unit}`,
    detail: buildLadderDetail({ ladder, categoryName: null, stepIndex: index, held, events }),
  }));
}
