import type { ReviewDraftTarget } from "@roll-and-call/database/reviews";

import { REVIEW_WINDOW, reviewWindowOf } from "@/entities/review";

import { REVIEW_BLOCK, type ReviewBlock } from "./review-block";

export function writeWindowBlock(
  game: Pick<ReviewDraftTarget["game"], "confirmedAt" | "playMinutes" | "endedAt">,
  now: Date,
): ReviewBlock | null {
  const window = reviewWindowOf(game, now);
  if (window === REVIEW_WINDOW.notStarted) return REVIEW_BLOCK.notStarted;
  return window === REVIEW_WINDOW.closed ? REVIEW_BLOCK.writePeriodOver : null;
}
