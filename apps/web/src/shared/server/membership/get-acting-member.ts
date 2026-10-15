import "server-only";
import { cache } from "react";

import { getCurrentUser } from "../auth/get-current-user";
import { resolveMember } from "./resolve-member";

// 서버 액션용. 쿠키 값을 믿지 않고 Auth 서버로 확인한 사용자가 지금 서버의 멤버일 때만 돌려준다.
export const getActingMember = cache(async () => {
  const member = await resolveMember(getCurrentUser);
  return member && { server: member.server, user: member.user };
});
