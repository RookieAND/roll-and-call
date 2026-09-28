"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";

import { REVIEW_REASONS } from "@/shared/lib";
import {
  moderateReview,
  requireStaff,
  syncReviewForumPost,
  type ReviewModeration,
} from "@/shared/server";

import { REASON_ACTIONS } from "../model/review-action";

export async function submitReviewModeration(reviewId: string, moderation: ReviewModeration) {
  const staff = await requireStaff();
  const needsReason = REASON_ACTIONS.includes(moderation.action);
  if (needsReason && !REVIEW_REASONS.includes(moderation.reason!)) {
    throw new Error("사유를 골라 주세요");
  }
  const result = await moderateReview(reviewId, staff, {
    action: moderation.action,
    reason: needsReason ? moderation.reason : null,
    staffMemo: moderation.staffMemo.trim(),
  });
  revalidatePath("/", "layout");
  if (result.ok) {
    after(() => syncReviewForumPost(reviewId, process.env.NEXT_PUBLIC_USER_APP_URL));
  }
  return result;
}
