import { REVIEW_STATUS, type ReviewStatus } from "@/widgets/game-detail";

import { MANAGE_REVIEW_BUTTON, type ManageReviewButton } from "./manage-review-button";

export function manageReviewButtonOf(status: ReviewStatus): ManageReviewButton | null {
  if (status === REVIEW_STATUS.writable) return MANAGE_REVIEW_BUTTON.write;
  if (status === REVIEW_STATUS.written) return MANAGE_REVIEW_BUTTON.view;
  return null;
}
