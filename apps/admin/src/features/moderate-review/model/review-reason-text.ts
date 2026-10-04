import { REVIEW_REASON, REVIEW_REASONS } from "@/shared/lib";

export const OTHER_TEXT_MAX_LENGTH = 100;

interface ReviewReasonTextOptions {
  reasonKey: string | null;
  otherText: string;
}

// 저장·알림·활동 기록에 쓰는 사유 글자. 칩 이름이고, 기타면 「기타 · {입력}」(구인 숨김과 같은 모양)이다.
// 고르지 않았거나 기타 입력이 비었거나 100자를 넘으면 빈 문자열이다.
export function reviewReasonText({ reasonKey, otherText }: ReviewReasonTextOptions) {
  const key = REVIEW_REASONS.find((candidate) => candidate === reasonKey);
  if (!key) return "";
  if (key !== "other") return REVIEW_REASON[key];
  const text = otherText.trim();
  if (!text || text.length > OTHER_TEXT_MAX_LENGTH) return "";
  return `${REVIEW_REASON.other} · ${text}`;
}
