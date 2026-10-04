import "server-only";
import { getServerBySlug } from "@roll-and-call/database/servers";
import { isServerSlug } from "@roll-and-call/database/servers/model";

import { loadRecentMemberServer } from "./load-recent-member-server";

interface HelpServer {
  name: string;
  inviteUrl: string;
}

// 도움말 내용은 서버와 무관하고, 문의 카드의 디스코드 링크만 접속한 서버를 따른다(D297·D302).
// 접속한 서버는 ?from={slug}, 없거나 못 찾으면 로그인한 사람의 최근 방문 가입 서버.
export async function loadHelpServer(from: string | null): Promise<HelpServer | null> {
  const slug = from ?? undefined;
  const fromServer = isServerSlug(slug) ? await getServerBySlug(slug) : undefined;
  const server = fromServer ?? (await loadRecentMemberServer());
  if (!server?.inviteUrl) return null;
  return { name: server.name, inviteUrl: server.inviteUrl };
}
