import { REVIEW_STATE, type ReviewState } from "./review-state";

// 숨긴 후기는 고쳐서 해제를 요청하라고 안내하므로 기한과 상관없이 고칠 수 있다.
export function canEditReview(state: ReviewState): boolean {
  return state === REVIEW_STATE.editable || state === REVIEW_STATE.hidden;
}
