import {
  BADGE_LADDER,
  BADGE_LADDERS,
  stepName,
  type BadgeLadderKey,
} from "@roll-and-call/database/badges/model";

import { badgeCondition } from "./badge-condition";
import type { BadgeCounts } from "./badge-counts";
import { nextStep } from "./next-step";

type Candidate = { ladder: BadgeLadderKey; count: number; categoryName: string | null };

// 다음 뱃지(R17). 단계형 가운데 진행 비율이 가장 높은 것, 같으면 남은 횟수가 적은 것, 그것도 같으면 후보 순서. 0회인 사다리는 뺀다.
export function nextBadgeGoal(counts: BadgeCounts) {
  const candidates: Candidate[] = [
    { ladder: BADGE_LADDER.playerTotal, count: counts.playerTotal, categoryName: null },
    { ladder: BADGE_LADDER.gmTotal, count: counts.gmTotal, categoryName: null },
    ...counts.playerRules.map((rule) => ({
      ladder: BADGE_LADDER.playerRule,
      count: rule.count,
      categoryName: rule.categoryName,
    })),
    ...counts.gmRules.map((rule) => ({
      ladder: BADGE_LADDER.gmRule,
      count: rule.count,
      categoryName: rule.categoryName,
    })),
    { ladder: BADGE_LADDER.gmVariety, count: counts.gmVariety, categoryName: null },
  ];

  const goals = candidates.flatMap((candidate) => {
    if (candidate.count === 0) return [];
    const step = nextStep({ steps: BADGE_LADDERS[candidate.ladder].steps, count: candidate.count });
    if (!step) return [];
    return [
      {
        emoji: step.emoji,
        name: stepName({ step, categoryName: candidate.categoryName }),
        remaining: step.threshold - candidate.count,
        count: candidate.count,
        threshold: step.threshold,
        condition: badgeCondition({
          ladder: candidate.ladder,
          step,
          categoryName: candidate.categoryName,
        }),
      },
    ];
  });
  return (
    goals.toSorted(
      (left, right) =>
        right.count / right.threshold - left.count / left.threshold ||
        left.remaining - right.remaining,
    )[0] ?? null
  );
}
