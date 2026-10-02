import "server-only";
import { getActiveMembership } from "@roll-and-call/database/servers";

import { getCurrentServer } from "../auth/get-current-server";
import { getCurrentUser } from "../auth/get-current-user";

// 서버 액션용. 쿠키 값을 믿지 않고 Auth 서버로 확인한 사용자가 지금 서버의 멤버일 때만 돌려준다.
export async function getActingMember() {
  const [server, user] = await Promise.all([getCurrentServer(), getCurrentUser()]);
  if (!user) return null;
  const membership = await getActiveMembership({ serverId: server.id, userId: user.id });
  return membership ? { server, user } : null;
}
