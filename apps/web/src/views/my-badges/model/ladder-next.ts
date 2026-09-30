import { BADGE_LADDERS, type BadgeLadderKey } from "@roll-and-call/database/rules";

import { nextStep, stepName } from "@/entities/badge";
import { LADDER_META } from "@/features/view-badge";

// "수호자까지 36회" 카드. 끝 단계까지 받았으면 null.
export function ladderNext(
  ladder: BadgeLadderKey,
  count: number,
  categoryName: string | null = null,
) {
  const step = nextStep(BADGE_LADDERS[ladder].steps, count);
  if (!step) return null;
  const unit = LADDER_META[ladder].unit;
  return {
    label: `${stepName(step, categoryName)}까지 ${step.threshold - count}${unit}`,
    countLabel: `${count} / ${step.threshold}`,
    value: count,
    max: step.threshold,
  };
}
