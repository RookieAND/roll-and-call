import { POST_STATUS } from "./post-status";
import type { Session } from "./types";

// 세션 일시가 지났으면 종료, 아니면 GM이 정한 모집 상태. 정해 둔 값이 없으면 정원으로 가른다.
export function postStatusOf(session: Session, now: number = Date.now()) {
  if (session.startsAt.getTime() < now) return POST_STATUS.ended;
  if (session.recruitStatus) return session.recruitStatus;
  return session.memberIds.length >= session.capacity
    ? POST_STATUS.confirmed
    : POST_STATUS.recruiting;
}
