import { PROFILE_SESSION_TAB, type ProfileSessionTab } from "./profile-sessions";

// 기본 탭(진행)은 주소에 남기지 않는다.
export function userSessionsHref(userId: string, tab: ProfileSessionTab): string {
  const base = `/u/${userId}/sessions`;
  return tab === PROFILE_SESSION_TAB.hosted ? base : `${base}?tab=${tab}`;
}
