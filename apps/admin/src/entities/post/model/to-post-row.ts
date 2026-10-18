import type { Session } from "@/shared/server";

import type { PostRow } from "./post-row";
import { postStaffAction } from "./post-staff-action";
import { postStatusOf } from "./post-status-of";

export function toPostRow({
  nicknames,
  session,
}: {
  nicknames: ReadonlyMap<string, string>;
  session: Session;
}): PostRow {
  return {
    id: session.id,
    title: session.title,
    gmNickname: nicknames.get(session.gmId) ?? "",
    rulebook: session.rulebook,
    sessionAt: session.timeFixed ? session.startsAt : null,
    memberCount: session.memberIds.length,
    capacity: session.capacity,
    status: postStatusOf(session),
    staffAction: postStaffAction(session),
  };
}
