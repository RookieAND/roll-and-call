"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";

import { REVIEW_REASON, REVIEW_REASONS } from "@/shared/lib";
import {
  getCurrentServer,
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
  const server = await getCurrentServer();
  const result = await moderateReview({
    serverId: server.id,
    id: reviewId,
    actor: staff,
    moderation: {
      action: moderation.action,
      reasonLabel: needsReason ? REVIEW_REASON[moderation.reason!] : "",
      staffMemo: moderation.staffMemo.trim(),
    },
  });
  revalidatePath("/", "layout");
  if (result.ok) {
    after(() =>
      syncReviewForumPost({
        serverId: server.id,
        reviewId,
        siteOrigin: process.env.NEXT_PUBLIC_USER_APP_URL,
      }),
    );
  }
  return result;
}
