import { richTextLength, richTextNonSpaceLength } from "@/shared/lib";

import { REVIEW_BODY_MIN_LENGTH } from "./review-rules";

// 후기 본문을 낼 수 있는지 본다. 글자 수는 공백을 포함해 세지만, 공백만 있는 본문은 글자 수와 상관없이 막는다.
// 낼 수 있으면 null, 아니면 화면에 보일 문구(마침표 없음).
export function reviewBodyError(body: string): string | null {
  if (richTextNonSpaceLength(body) === 0) return "내용을 적어 주세요";
  if (richTextLength(body) < REVIEW_BODY_MIN_LENGTH) {
    return `${REVIEW_BODY_MIN_LENGTH}자 이상 적어 주세요`;
  }
  return null;
}
