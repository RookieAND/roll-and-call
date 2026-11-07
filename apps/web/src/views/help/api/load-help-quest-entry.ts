import "server-only";
import { getQuestClears } from "@roll-and-call/database/onboarding";
import { ONBOARDING_QUESTS } from "@roll-and-call/database/onboarding/model";
import { getServerBySlug } from "@roll-and-call/database/servers";
import { isServerSlug } from "@roll-and-call/database/servers/model";

import { serverPath } from "@/shared/lib";
import { getCurrentSessionUser } from "@/shared/server";

import { loadRecentMemberServer } from "./load-recent-member-server";

export const HELP_QUEST_FALLBACK_HREF = "/onboarding";

interface HelpQuestEntry {
  href: string;
  // 「n / 4」. 로그인하지 않았거나 서버를 못 찾으면 숨긴다.
  progress: string | null;
}

// 도움말은 서버 밖이라 퀘스트 목록의 서버를 고른다. 문의 카드와 같은 규칙: ?from={slug}, 없으면 최근 방문 가입 서버.
// 둘 다 없으면 옛 주소 /onboarding으로 보내 기본 서버로 옮긴다.
export async function loadHelpQuestEntry(from: string | null): Promise<HelpQuestEntry> {
  const user = await getCurrentSessionUser();
  const slug = from ?? undefined;
  const fromServer = isServerSlug(slug) ? await getServerBySlug(slug) : undefined;
  const server = fromServer ?? (await loadRecentMemberServer());
  if (!server) return { href: HELP_QUEST_FALLBACK_HREF, progress: null };
  const href = serverPath({ slug: server.slug, path: "/onboarding" });
  if (!user) return { href, progress: null };
  const cleared = await getQuestClears({ serverId: server.id, userId: user.id });
  return { href, progress: `${cleared.length} / ${ONBOARDING_QUESTS.length}` };
}
