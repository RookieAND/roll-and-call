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
  {
    game,
    participant,
    review,
    suspended,
    isGm,
    confirmedCount,
  }: Pick<
    ReviewDraftTarget,
    "game" | "participant" | "review" | "suspended" | "isGm" | "confirmedCount"
  >,
  now: Date = new Date(),
): ReviewBlock | null {
  if (isGm) return gmReviewBlockOf({ game, review, suspended, confirmedCount }, now);
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
  if (suspended) return REVIEW_BLOCK.suspended;
  const firstConfirmedAt = game.attendanceFirstConfirmedAt ?? game.attendanceConfirmedAt;
  if (reviewWriteDeadline(firstConfirmedAt).getTime() <= now.getTime()) {
    return REVIEW_BLOCK.writePeriodOver;
  }
  return null;
}

// GM 후기에는 불참 보류가 없다. 확정 참석자가 1명 이상이어야 쓴다.
function gmReviewBlockOf(
  {
    game,
    review,
    suspended,
    confirmedCount,
  }: Pick<ReviewDraftTarget, "game" | "review" | "suspended" | "confirmedCount">,
  now: Date,
): ReviewBlock | null {
  if (review) {
    const state = deriveReviewState({ ...review, authorAbsent: false }, now);
    if (state === REVIEW_STATE.removed) return REVIEW_BLOCK.unavailable;
    return canEditReview(state) ? null : REVIEW_BLOCK.editPeriodOver;
  }

  if (!game.attendanceConfirmedAt) return REVIEW_BLOCK.attendancePending;
  if (confirmedCount < 1) return REVIEW_BLOCK.unavailable;
  if (suspended) return REVIEW_BLOCK.suspended;
  const firstConfirmedAt = game.attendanceFirstConfirmedAt ?? game.attendanceConfirmedAt;
  if (reviewWriteDeadline(firstConfirmedAt).getTime() <= now.getTime()) {
    return REVIEW_BLOCK.writePeriodOver;
  }
  return null;
}
