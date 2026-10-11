import {
  MESSAGE_CASES,
  REVIEW_CASE_KEY,
  type MessageCaseKey,
} from "@roll-and-call/database/servers/model";
import type { Metadata } from "next";

import { loadMessageRoles } from "@/features/edit-discord-messages";
import { stringParams } from "@/shared/lib";
import {
  getCurrentServer,
  getMessageHeads,
  getMessageTexts,
  getReviewTemplate,
  requireStaff,
} from "@/shared/server";
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
    query.case === REVIEW_CASE_KEY
      ? REVIEW_CASE_KEY
      : (MESSAGE_CASES.find((messageCase) => messageCase.key === query.case)?.key ??
        ("open" satisfies MessageCaseKey));
  const [heads, texts, reviewTemplate, guildRoles] = await Promise.all([
    getMessageHeads({ serverId: server.id }),
    getMessageTexts({ serverId: server.id }),
    getReviewTemplate({ serverId: server.id }),
    loadMessageRoles(server.discordGuildId),
  ]);
  return (
    <MessagesView
      selected={selected}
      heads={heads}
      texts={texts}
      reviewTemplate={reviewTemplate}
      guildRoles={guildRoles}
      readOnly={viewer.role !== "owner"}
    />
  );
}
