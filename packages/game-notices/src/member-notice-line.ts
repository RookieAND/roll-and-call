import { getDiscordId } from "@roll-and-call/database/profiles";
import type { MessageTextKey } from "@roll-and-call/database/servers";
import { compact } from "es-toolkit";

import { messageText } from "./message-text";

// 본문에 붙일 "<@멘션>님이 …" 한 줄과 알림 대상. 문장은 서버가 정한다. 디스코드 계정을 아는 사람만 멘션하고, 아무도 없으면 붙이지 않는다.
export async function memberNoticeLine({
  serverId,
  userIds,
  variable = "참여자",
  key,
  values,
}: {
  serverId: string;
  userIds: readonly string[];
  variable?: string;
  key: MessageTextKey;
  values: Record<string, string | undefined>;
}) {
  const discordIds = compact(await Promise.all(userIds.map((userId) => getDiscordId(userId))));
  if (discordIds.length === 0) return {};
  const after = await messageText({
    serverId,
    key,
    values: { ...values, [variable]: discordIds.map((discordId) => `<@${discordId}>`).join(", ") },
  });
  return { after, userMentions: discordIds };
}
