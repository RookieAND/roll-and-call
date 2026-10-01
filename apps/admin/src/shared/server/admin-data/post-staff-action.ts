import type { PostStaffAction } from "./list-posts";
import type { Session } from "./types";

export function postStaffAction(
  session: Pick<Session, "hidden" | "editRequestedAt">,
): PostStaffAction | null {
  if (session.hidden) return "숨김";
  if (session.editRequestedAt) return "수정 요청";
  return null;
}
