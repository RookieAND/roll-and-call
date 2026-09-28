import { PARTICIPANT_STATUS } from "@/entities/game";
import {
  canEditReview,
  deriveReviewState,
  REVIEW_STATE,
  reviewWriteDeadline,
} from "@/entities/review";
import type { ReviewDraftTarget } from "@/shared/server";

import { REVIEW_BLOCK, type ReviewBlock } from "./review-block";

// 이미 쓴 후기가 있으면 고치기, 없으면 새로 쓰기다. 막히면 그 사정을 돌려준다.
export function reviewBlockOf(
  { game, participant, review }: Pick<ReviewDraftTarget, "game" | "participant" | "review">,
  now: Date = new Date(),
): ReviewBlock | null {
  if (!participant || participant.status !== PARTICIPANT_STATUS.confirmed) {
    return REVIEW_BLOCK.unavailable;
  }
  const authorAbsent = participant.absent && participant.absenceCancelledAt === null;

  if (review) {
    const state = deriveReviewState({ ...review, authorAbsent }, now);
    if (state === REVIEW_STATE.removed) return REVIEW_BLOCK.unavailable;
    if (state === REVIEW_STATE.held) return REVIEW_BLOCK.absent;
    return canEditReview(state) ? null : REVIEW_BLOCK.editPeriodOver;
  }

  if (!game.attendanceConfirmedAt) return REVIEW_BLOCK.attendancePending;
  if (authorAbsent) return REVIEW_BLOCK.absent;
  if (reviewWriteDeadline(game.attendanceConfirmedAt).getTime() <= now.getTime()) {
    return REVIEW_BLOCK.writePeriodOver;
  }
  return null;
}
