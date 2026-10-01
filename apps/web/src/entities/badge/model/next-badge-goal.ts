import { BADGE_LADDER, BADGE_LADDERS, type BadgeLadderKey } from "@roll-and-call/database/rules";

import { badgeCondition } from "./badge-condition";
import type { BadgeCounts } from "./badge-counts";
import { nextStep } from "./next-step";
import { stepName } from "./step-name";

type Candidate = { ladder: BadgeLadderKey; count: number; categoryName: string | null };

export function nextBadgeGoal(counts: BadgeCounts) {
  const candidates: Candidate[] = [
    { ladder: BADGE_LADDER.playerTotal, count: counts.playerTotal, categoryName: null },
    { ladder: BADGE_LADDER.playerReviews, count: counts.playerReviews, categoryName: null },
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
  ];
  if (counts.gmTotal > 0) {
    candidates.push(
      { ladder: BADGE_LADDER.gmTotal, count: counts.gmTotal, categoryName: null },
      { ladder: BADGE_LADDER.gmVariety, count: counts.gmVariety, categoryName: null },
      { ladder: BADGE_LADDER.gmReviews, count: counts.gmReviews, categoryName: null },
    );
  }

  const goals = candidates.flatMap((candidate) => {
    const step = nextStep(BADGE_LADDERS[candidate.ladder].steps, candidate.count);
    if (!step) return [];
    const name = stepName(step, candidate.categoryName);
    return [
      {
        emoji: step.emoji,
        name,
        remaining: step.threshold - candidate.count,
        count: candidate.count,
        threshold: step.threshold,
        condition: badgeCondition(candidate.ladder, step, candidate.categoryName),
      },
    ];
  });
  return goals.toSorted((left, right) => left.remaining - right.remaining)[0] ?? null;
}
