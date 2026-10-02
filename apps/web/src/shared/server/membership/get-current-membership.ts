import "server-only";
import { getActiveMembership } from "@roll-and-call/database/servers";
import { cache } from "react";

import { getCurrentServer } from "../auth/get-current-server";
import { getCurrentSessionUser } from "../auth/get-current-session-user";

// 지금 서버에서 로그인한 사람의 멤버십. 비로그인이거나 가입하지 않았으면 null.
export const getCurrentMembership = cache(async () => {
  const [server, user] = await Promise.all([getCurrentServer(), getCurrentSessionUser()]);
  if (!user) return null;
  return (await getActiveMembership({ serverId: server.id, userId: user.id })) ?? null;
});
