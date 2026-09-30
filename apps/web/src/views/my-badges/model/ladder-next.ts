import { BADGE_LADDERS, type BadgeLadderKey } from "@roll-and-call/database/rules";

import { nextStep, stepName } from "@/entities/badge";
import { LADDER_META } from "@/features/view-badge";

// "수호자까지 36회" 카드. 끝 단계까지 받았으면 done이고 막대는 가득 찬다.
export function ladderNext(
  ladder: BadgeLadderKey,
  count: number,
  categoryName: string | null = null,
) {
  const steps = BADGE_LADDERS[ladder].steps;
  const step = nextStep(steps, count);
  if (!step) {
    const last = steps.at(-1)!;
    return {
      done: true,
      label: "마지막 단계를 받았습니다",
      countLabel: `${count} / ${last.threshold}`,
      value: last.threshold,
      max: last.threshold,
    };
  }
  const unit = LADDER_META[ladder].unit;
  return {
    done: false,
    label: `${stepName(step, categoryName)}까지 ${step.threshold - count}${unit}`,
    countLabel: `${count} / ${step.threshold}`,
    value: count,
    max: step.threshold,
  };
}

export type LadderNext = ReturnType<typeof ladderNext>;
