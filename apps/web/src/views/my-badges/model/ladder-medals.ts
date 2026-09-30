import { BADGE_LADDERS, type BadgeEvent, type BadgeLadderKey } from "@roll-and-call/database/rules";

import { badgeRequirement, stepName } from "@/entities/badge";
import { buildLadderDetail, LADDER_META } from "@/features/view-badge";
import type { BadgeRecord } from "@/shared/server";

import type { DexMedal } from "./dex-medal";
import { heldRecord } from "./held-record";

// 사다리의 모든 단계를 메달로. 받은 단계는 색을 입히고, 방금 받은 단계에 새 뱃지 점을 찍는다.
export function ladderMedals(
  ladder: BadgeLadderKey,
  events: BadgeEvent[],
  record: BadgeRecord | undefined,
  categoryName: string | null = null,
): DexMedal[] {
  const held = heldRecord(ladder, events, record);
  const heldTier = held?.tier ?? 0;
  const unit = LADDER_META[ladder].unit;
  return BADGE_LADDERS[ladder].steps.map((step, index) => ({
    key: `${ladder}-${index}`,
    emoji: step.emoji,
    grade: step.grade,
    locked: index >= heldTier,
    isNew: index + 1 === heldTier && record?.seenAt === null,
    name: stepName(step, categoryName),
    caption:
      categoryName === null && unit === "회"
        ? `${step.threshold}회`
        : badgeRequirement(ladder, step, categoryName),
    threshold: step.threshold,
    detail: buildLadderDetail({ ladder, categoryName, stepIndex: index, held, events }),
  }));
}
