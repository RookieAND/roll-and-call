import { isNil } from "es-toolkit";

import type { Session } from "./types";

type RecognizedCandidate = Pick<Session, "memberIds" | "hidden" | "cancelled" | "endsAt">;

// 어드민의 인정 세션(진행된 세션) 판정은 이 함수 하나다(R5, D33). 홈·유저 참여 세션 수(A3)·분석(A6)이 쓴다.
// 끝났고 확정 참여자가 1명 이상이며 숨김·취소가 아니다. 출석 확정은 기다리지 않는다(사용자 웹 isRecordSession과 같은 기준).
export function isRecognizedPost(post: RecognizedCandidate, now: Date = new Date()) {
  if (post.cancelled || !isNil(post.hidden) || post.memberIds.length === 0) return false;
  return !isNil(post.endsAt) && post.endsAt.getTime() <= now.getTime();
}
