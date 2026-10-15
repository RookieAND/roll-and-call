import { findUserNickname } from "@/shared/lib";
import type { Snapshot, Session } from "@/shared/server";

import type { PostRow } from "./post-row";
import { postStaffAction } from "./post-staff-action";
import { postStatusOf } from "./post-status-of";

export function toPostRow({ db, session }: { db: Snapshot; session: Session }): PostRow {
  return {
    id: session.id,
    title: session.title,
    gmNickname: findUserNickname({ users: db.users, userId: session.gmId }),
    rulebook: session.rulebook,
    sessionAt: session.timeFixed ? session.startsAt : null,
    memberCount: session.memberIds.length,
    capacity: session.capacity,
    status: postStatusOf(session),
    staffAction: postStaffAction(session),
  };
}
