import { listMemberServers } from "@roll-and-call/database/servers";

import { ServerSwitcher } from "@/shared/ui";
import { loadTodos } from "@/widgets/session-list";

interface HomeServerSwitchProps {
  userId: string;
}

// 메뉴 각 줄에 그 서버의 할 일 수(알림 탭 [할 일]과 같은 수, 인증 반려 포함)를 단다. 안 읽은 알림은 세지 않는다(R15).
// ponytail: 서버마다 loadTodos를 한 번씩 부른다. 가입 서버가 많아지면 건수만 세는 쿼리로 바꾼다.
export async function HomeServerSwitch({ userId }: HomeServerSwitchProps) {
  const servers = await listMemberServers(userId);
  if (servers.length < 2) return <ServerSwitcher />;
  const withTodo = await Promise.all(
    servers.map(async ({ id, slug, name, icon }) => {
      const { count } = await loadTodos(id, userId);
      return { slug, name, icon, todoCount: count };
    }),
  );
  return <ServerSwitcher servers={withTodo} />;
}
