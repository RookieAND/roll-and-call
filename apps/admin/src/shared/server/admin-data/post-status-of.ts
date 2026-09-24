import { POST_STATUS } from "./post-status";
import type { Session } from "./types";

// 스냅샷이 구인마다 상태를 정해 둔다. 없으면 세션 일시와 정원으로 가른다.
export function postStatusOf(session: Session, now: number = Date.now()) {
  if (session.recruitStatus) return session.recruitStatus;
  if (session.startsAt.getTime() < now) return POST_STATUS.ended;
  return session.memberIds.length >= session.capacity
    ? POST_STATUS.confirmed
    : POST_STATUS.recruiting;
}
