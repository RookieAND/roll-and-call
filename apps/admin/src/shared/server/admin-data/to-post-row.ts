import type { PostRow } from "./post-row";
import { postStaffAction } from "./post-staff-action";
import { postStatusOf } from "./post-status-of";
import type { Snapshot } from "./snapshot";
import type { Session } from "./types";

export function toPostRow({ db, session }: { db: Snapshot; session: Session }): PostRow {
  return {
    id: session.id,
    title: session.title,
    gmNickname: db.users.find((user) => user.id === session.gmId)!.nickname,
    rulebook: session.rulebook,
    sessionAt: session.timeFixed ? session.startsAt : null,
    memberCount: session.memberIds.length,
    capacity: session.capacity,
    status: postStatusOf(session),
    staffAction: postStaffAction(session),
  };
}
