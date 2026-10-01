import { isNull } from "es-toolkit";

import { PARTICIPANT_STATUS } from "@/entities/game";
import {
  canEditReview,
  deriveReviewState,
  REVIEW_STATE,
  reviewWriteDeadline,
} from "@/entities/review";
import type { ReviewDraftTarget } from "@/shared/server";

import { REVIEW_BLOCK, type ReviewBlock } from "./review-block";

export function reviewBlockOf(
  { game, participant, review }: Pick<ReviewDraftTarget, "game" | "participant" | "review">,
  now: Date = new Date(),
): ReviewBlock | null {
  if (!participant || participant.status !== PARTICIPANT_STATUS.confirmed) {
    return REVIEW_BLOCK.unavailable;
  }
  const authorAbsent = participant.absent && isNull(participant.absenceCancelledAt);

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
