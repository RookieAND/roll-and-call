import { reviewEditDeadline } from "./review-edit-deadline";
import { REVIEW_STATE, type ReviewState } from "./review-state";

interface ReviewStateInput {
  createdAt: Date | string;
  hiddenAt: Date | string | null;
  removedAt: Date | string | null;
  authorAbsent: boolean;
}

export function deriveReviewState(review: ReviewStateInput, now: Date = new Date()): ReviewState {
  if (review.removedAt) return REVIEW_STATE.removed;
  if (review.hiddenAt) return REVIEW_STATE.hidden;
  if (review.authorAbsent) return REVIEW_STATE.held;
  return reviewEditDeadline(review.createdAt).getTime() > now.getTime()
    ? REVIEW_STATE.editable
    : REVIEW_STATE.locked;
}
