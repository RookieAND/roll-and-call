import "server-only";
import { AUTH_REQUIRED_MESSAGE } from "@/shared/api";

import { getCurrentUser } from "../auth/get-current-user";
import { MEMBERSHIP_REQUIRED_MESSAGE } from "./membership-required-message";

// getActingMember()가 null일 때 액션이 돌려줄 문구. 로그인 전이면 로그인, 로그인했으면 가입을 안내한다.
export async function notMemberError() {
  return (await getCurrentUser()) ? MEMBERSHIP_REQUIRED_MESSAGE : AUTH_REQUIRED_MESSAGE;
}
