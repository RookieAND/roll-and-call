import type { Session } from "@/shared/server";

import type { PostStaffAction } from "./post-row";

export function postStaffAction(session: Pick<Session, "hidden">): PostStaffAction | null {
  return session.hidden ? "숨김" : null;
}
