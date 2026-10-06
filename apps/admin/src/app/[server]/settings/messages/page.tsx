import { MESSAGE_CASES, type MessageCaseKey } from "@roll-and-call/database/servers/model";
import type { Metadata } from "next";

import { loadMessageRoles } from "@/features/edit-discord-messages";
import { getCurrentServer, getMessageHeads, getMessageTexts, requireStaff } from "@/shared/server";
import { MessagesView } from "@/views/settings";

export const metadata: Metadata = { title: "설정 · 디스코드 메시지" };

// 운영진도 볼 수 있어 settings/(owner) 가드 밖에 있다. 고치는 것은 서버 액션이 소유자만 허락한다.
export default async function SettingsMessagesPage({
  searchParams,
}: PageProps<"/[server]/settings/messages">) {
  const [query, viewer, server] = await Promise.all([
    searchParams as Promise<Record<string, string | undefined>>,
    requireStaff(),
    getCurrentServer(),
  ]);
  const selected =
    MESSAGE_CASES.find((messageCase) => messageCase.key === query.case)?.key ??
    ("open" satisfies MessageCaseKey);
  const [heads, texts, guildRoles] = await Promise.all([
    getMessageHeads({ serverId: server.id }),
    getMessageTexts({ serverId: server.id }),
    loadMessageRoles(server.discordGuildId),
  ]);
  return (
    <MessagesView
      selected={selected}
      heads={heads}
      texts={texts}
      guildRoles={guildRoles}
      readOnly={viewer.role !== "owner"}
    />
  );
}
