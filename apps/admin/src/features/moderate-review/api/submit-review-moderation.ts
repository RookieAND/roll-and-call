"use server";

import {
  CONTENT_REASON,
  parseReason,
  type ChosenReason,
} from "@roll-and-call/database/moderation/model";

import { requireStaff } from "@/shared/server";

import { REVIEW_ACTION, type ReviewAction } from "../model/review-action";
import { runReviewModeration } from "./run-review-moderation";

interface SubmitReviewModerationOptions {
  reviewId: string;
  moderation: { action: ReviewAction; reason: ChosenReason | null };
}

export async function submitReviewModeration({
  reviewId,
  moderation,
}: SubmitReviewModerationOptions) {
  const staff = await requireStaff();
  const { action } = moderation;
  const reason =
    action === REVIEW_ACTION.unhide
      ? null
      : parseReason({ reason: moderation.reason, reasons: CONTENT_REASON });
  return runReviewModeration({ staff, reviewId, action, reason });
}
