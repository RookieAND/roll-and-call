import { reviewBlockOf } from "@/features/write-review";
import type { ReviewDraftTarget } from "@/shared/server";

import { REVIEW_STATUS, type ReviewStatus } from "./review-status";

// 쓴 후기가 있으면 쓴 뒤, 막는 이유가 없으면 작성 가능(W14의 reviewBlockOf가 정한다).
export function reviewStatusOf(
  target: ReviewDraftTarget | null,
  now: Date = new Date(),
): ReviewStatus {
  if (!target) return REVIEW_STATUS.unavailable;
  if (target.review) return REVIEW_STATUS.written;
  return reviewBlockOf(target, now) ? REVIEW_STATUS.unavailable : REVIEW_STATUS.writable;
}
