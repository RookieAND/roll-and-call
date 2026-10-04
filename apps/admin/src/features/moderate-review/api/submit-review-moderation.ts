"use server";

import { requireStaff } from "@/shared/server";

import { requiredReviewReason } from "../model/required-review-reason";
import { REVIEW_ACTION, type ReviewAction } from "../model/review-action";
import { runReviewModeration } from "./run-review-moderation";

interface SubmitReviewModerationOptions {
  reviewId: string;
  moderation: { action: ReviewAction; reasonKey: string | null; otherText: string };
}

export async function submitReviewModeration({
  reviewId,
  moderation,
}: SubmitReviewModerationOptions) {
  const staff = await requireStaff();
  const { action } = moderation;
  const reason = action === REVIEW_ACTION.unhide ? "" : requiredReviewReason(moderation);
  return runReviewModeration({ staff, reviewId, action, reason });
}
