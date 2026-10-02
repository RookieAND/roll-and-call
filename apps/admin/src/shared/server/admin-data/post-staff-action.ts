import type { PostStaffAction } from "./list-posts";
import type { Session } from "./types";

export function postStaffAction(session: Pick<Session, "hidden">): PostStaffAction | null {
  return session.hidden ? "숨김" : null;
}
