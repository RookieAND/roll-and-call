import { getServerBySlug } from "@roll-and-call/database/servers";

import { getCurrentSessionUser, listMemberServers } from "@/shared/server";

import { DesktopNavLoader } from "../[server]/desktop-nav-loader";

// 도움말은 서버 밖이라 좌측 내비의 서버를 고른다: 최근 방문한 가입 서버, 없으면 기본 서버.
export async function HelpDesktopNav() {
  const user = await getCurrentSessionUser();
  const [recentServer] = user ? await listMemberServers(user.id) : [];
  const server = recentServer ?? (await getServerBySlug(process.env.DEFAULT_SERVER_SLUG!));
  if (!server) return null;
  return <DesktopNavLoader server={server} userId={user?.id} />;
}
