import { getCurrentServer, listMemberServers } from "@/shared/server";
import { ServerSwitcher } from "@/shared/ui";
import { loadTodoCounts } from "@/widgets/session-list/server";

interface HomeServerSwitchProps {
  userId: string;
}

// 메뉴 각 줄에 그 서버의 할 일 수(알림 탭 [할 일]과 같은 수, 인증 반려 포함)를 단다. 안 읽은 알림은 세지 않는다(R15).
// ponytail: 서버마다 loadTodos를 하나씩 순서대로 부른다. 가입 서버가 많아지면 건수만 세는 쿼리로 바꾼다.
export async function HomeServerSwitch({ userId }: HomeServerSwitchProps) {
  const servers = await listMemberServers(userId);
  if (servers.length < 2) return <ServerSwitcher />;
  const current = await getCurrentServer();
  const counts = await loadTodoCounts({
    serverIds: servers.map(({ id }) => id),
    userId,
    firstId: current.id,
  });
  const withTodo = servers.map(({ id, slug, name, icon }) => ({
    slug,
    name,
    icon,
    todoCount: counts.get(id) ?? 0,
  }));
  return <ServerSwitcher servers={withTodo} />;
}
