import "server-only";
import { listMemberServers } from "@roll-and-call/database/servers";

import { getCurrentSessionUser, listJoinableServers } from "@/shared/server";
import { loadTodos } from "@/widgets/session-list";

// 시작 영역 우선순위: 가입한 서버 > 바로 가입할 수 있는 서버 > 없음. servers가 null이면 비로그인.
// 가입 서버가 2개 이상이면 메뉴 각 줄에 그 서버의 할 일 수(알림 탭 [할 일]과 같은 수, 인증 반려 포함)를 단다. 안 읽은 알림은 세지 않는다(R15).
// ponytail: 서버마다 loadTodos를 한 번씩 부른다. 가입 서버가 많아지면 건수만 세는 쿼리로 바꾼다.
export async function loadIndexServers() {
  const user = await getCurrentSessionUser();
  if (!user) return { servers: null, joinable: [] };
  const servers = await listMemberServers(user.id);
  if (servers.length >= 2) {
    const withTodo = await Promise.all(
      servers.map(async (server) => {
        const { count } = await loadTodos(server.id, user.id);
        return { ...server, todoCount: count };
      }),
    );
    return { servers: withTodo, joinable: [] };
  }
  const joinable = servers.length === 0 ? await listJoinableServers(user.id) : [];
  return { servers, joinable };
}
