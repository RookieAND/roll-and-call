import "server-only";
import { listMemberServers } from "@roll-and-call/database/servers";

import { getCurrentSessionUser, listJoinableServers } from "@/shared/server";

// 시작 영역 우선순위: 가입한 서버 > 바로 가입할 수 있는 서버 > 없음. servers가 null이면 비로그인.
export async function loadIndexServers() {
  const user = await getCurrentSessionUser();
  if (!user) return { servers: null, joinable: [] };
  const servers = await listMemberServers(user.id);
  const joinable = servers.length === 0 ? await listJoinableServers(user.id) : [];
  return { servers, joinable };
}
