import { MESSAGE_CASES, type MessageCaseKey } from "@roll-and-call/database/servers/model";
import type { Metadata } from "next";

import { loadMessageRoles, loadRecruitForum } from "@/features/edit-discord-messages";
import { stringParams } from "@/shared/lib";
import { getCurrentServer, getMessageHeads, getMessageTexts, requireStaff } from "@/shared/server";
import { MessagesView } from "@/views/discord";

export const metadata: Metadata = { title: "Discord · 디스코드 메시지" };

// 운영진도 볼 수 있어 discord/(owner) 가드 밖에 있다. 고치는 것은 서버 액션이 소유자만 허락한다.
export default async function DiscordMessagesPage({
  searchParams,
}: PageProps<"/[server]/discord/messages">) {
  const [query, viewer, server] = await Promise.all([
    searchParams.then(stringParams),
    requireStaff(),
    getCurrentServer(),
  ]);
  const selected =
    MESSAGE_CASES.find((messageCase) => messageCase.key === query.case)?.key ??
    ("open" satisfies MessageCaseKey);
  const [heads, texts, guildRoles, recruitForum] = await Promise.all([
    getMessageHeads({ serverId: server.id }),
    getMessageTexts({ serverId: server.id }),
    loadMessageRoles(server.discordGuildId),
    loadRecruitForum(server.recruitChannelId),
  ]);
  return (
    <MessagesView
      selected={selected}
      heads={heads}
      texts={texts}
      guildRoles={guildRoles}
      recruitForum={recruitForum}
      readOnly={viewer.role !== "owner"}
    />
  );
}
