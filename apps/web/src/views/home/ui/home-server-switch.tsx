import { listMemberServers } from "@roll-and-call/database/servers";
import { isNull } from "es-toolkit";

import { ServerSwitcher } from "@/shared/ui";
import { loadMySessions } from "@/widgets/session-list";

interface HomeServerSwitchProps {
  userId: string;
}

// 메뉴 각 줄에 그 서버의 할 일 건수(할 일이 걸린 세션 수)를 단다.
// ponytail: 서버마다 loadMySessions를 한 번씩 부른다. 가입 서버가 많아지면 건수만 세는 쿼리로 바꾼다.
export async function HomeServerSwitch({ userId }: HomeServerSwitchProps) {
  const servers = await listMemberServers(userId);
  if (servers.length < 2) return <ServerSwitcher />;
  const withTodo = await Promise.all(
    servers.map(async ({ id, slug, name, icon }) => {
      const { host, player } = await loadMySessions({ serverId: id, userId });
      const todoCount = [...host, ...player].filter((session) => !isNull(session.todo)).length;
      return { slug, name, icon, todoCount };
    }),
  );
  return <ServerSwitcher servers={withTodo} />;
}
