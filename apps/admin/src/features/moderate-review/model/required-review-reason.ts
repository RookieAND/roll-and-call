import { REVIEW_REASONS } from "@/shared/lib";

import { reviewReasonText } from "./review-reason-text";

// 서버 액션이 숨김·제거 사유를 확인한다. 창은 사유가 없으면 확정을 막으므로 여기까지 오면 잘못된 요청이다.
export function requiredReviewReason({
  reasonKey,
  otherText,
}: {
  reasonKey: string | null;
  otherText: string;
}) {
  const reason = reviewReasonText({ reasonKey, otherText });
  if (reason) return reason;
  const known = REVIEW_REASONS.some((candidate) => candidate === reasonKey);
  throw new Error(known ? "기타 사유를 적어 주세요" : "사유를 골라 주세요");
}
