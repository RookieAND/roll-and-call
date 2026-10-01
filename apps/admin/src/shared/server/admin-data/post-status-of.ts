import { POST_STATUS } from "./post-status";
import type { Session } from "./types";

export function postStatusOf(session: Session, now: number = Date.now()) {
  if (session.recruitStatus) return session.recruitStatus;
  if (session.startsAt.getTime() < now) return POST_STATUS.ended;
  return session.memberIds.length >= session.capacity
    ? POST_STATUS.confirmed
    : POST_STATUS.recruiting;
}
