import "server-only";
import { cache } from "react";

import { getCurrentSessionUser } from "../auth/get-current-session-user";
import { resolveMember } from "./resolve-member";

// 화면용. 쿠키 세션의 사용자로 본다.
export const getCurrentMembership = cache(
  async () => (await resolveMember(getCurrentSessionUser))?.membership ?? null,
);
