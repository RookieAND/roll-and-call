import { getDiscordId } from "@roll-and-call/database/profiles";
import type { MessageTextKey } from "@roll-and-call/database/servers";

import { messageText } from "./message-text";

// 본문에 붙일 "<@멘션>님이 …" 한 줄과 알림 대상. 문장은 서버가 정한다. 디스코드 계정을 모르면 붙이지 않는다.
export async function memberNoticeLine({
  serverId,
  userId,
  key,
  values,
}: {
  serverId: string;
  userId: string;
  key: MessageTextKey;
  values: Record<string, string | undefined>;
}) {
  const discordId = await getDiscordId(userId);
  if (!discordId) return {};
  const after = await messageText({
    serverId,
    key,
    values: { ...values, 참여자: `<@${discordId}>` },
  });
  return { after, userMentions: [discordId] };
}
