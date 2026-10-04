import { CERT_REVIEW_STATE, type CertReviewState } from "@/features/decide-cert";
import type { CertReview } from "@/shared/server";

export function reviewState(review: CertReview): CertReviewState {
  if (review.withdrawnAt) return CERT_REVIEW_STATE.withdrawn;
  if (review.processed) return CERT_REVIEW_STATE.processed;
  if (review.waitingOn.length) return CERT_REVIEW_STATE.waiting;
  return CERT_REVIEW_STATE.open;
}
