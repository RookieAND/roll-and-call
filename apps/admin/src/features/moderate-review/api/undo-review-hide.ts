"use server";

import { requireStaff } from "@/shared/server";

import { REVIEW_ACTION } from "../model/review-action";
import { runReviewModeration } from "./run-review-moderation";

const UNDO_REASON = "숨김 되돌리기";

// 숨김 직후 토스트의 [되돌리기]. 숨김 해제와 같고 활동 기록 사유만 다르다.
export async function undoReviewHide(reviewId: string) {
  const staff = await requireStaff();
  return runReviewModeration({
    staff,
    reviewId,
    action: REVIEW_ACTION.unhide,
    reason: null,
    note: UNDO_REASON,
  });
}
