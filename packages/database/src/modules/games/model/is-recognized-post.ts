import { isNil } from "es-toolkit";

interface RecognizedCandidate {
  memberIds: readonly string[];
  hidden?: unknown;
  cancelled?: boolean;
  endsAt?: Date | null;
}

// 인정 세션(진행된 세션) 판정은 이 함수 하나다. 끝났고 확정 참여자가 1명 이상이며 숨김·취소가 아니다.
// 출석 확정은 기다리지 않는다(사용자 웹 isRecordSession과 같은 기준).
export function isRecognizedPost(post: RecognizedCandidate, now: Date = new Date()) {
  if (post.cancelled || !isNil(post.hidden) || post.memberIds.length === 0) return false;
  return !isNil(post.endsAt) && post.endsAt.getTime() <= now.getTime();
}
