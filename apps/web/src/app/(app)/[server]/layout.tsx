import { markMemberVisit } from "@roll-and-call/database/servers";
import { after } from "next/server";

import { getCurrentServer, getCurrentSessionUser } from "@/shared/server";
import { ServerNavProvider } from "@/shared/ui";

// 주소의 slug로 서버를 찾는다. 없는 서버면 getCurrentServer가 404로 보낸다.
// 내 서버 목록이 최근 방문 순이라 들어올 때마다 방문 시각을 남긴다.
export default async function ServerLayout({ children }: LayoutProps<"/[server]">) {
  const [server, user] = await Promise.all([getCurrentServer(), getCurrentSessionUser()]);
  if (user) after(() => markMemberVisit({ serverId: server.id, userId: user.id }));
  return (
    <ServerNavProvider current={{ slug: server.slug, name: server.name, icon: server.icon }}>
      {children}
    </ServerNavProvider>
  );
}
