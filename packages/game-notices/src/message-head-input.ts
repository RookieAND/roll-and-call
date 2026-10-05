import type { Server } from "@roll-and-call/database";
import {
  getMessageHeads,
  type MessageCaseKey,
  renderMessageHead,
  roleMentionIds,
} from "@roll-and-call/database/servers";
import type { DiscordMessageInput } from "@roll-and-call/discord";

import { gameUrl } from "./game-url";

export function gameHeadValues({
  server,
  game,
  gmName,
}: {
  server: Server;
  game: { id: string; title: string; rule: string };
  gmName: string;
}) {
  return {
    "구인 제목": game.title,
    GM: gmName,
    룰: game.rule,
    링크: gameUrl({ slug: server.slug, gameId: game.id }),
  };
}

// 서버가 정한 머리 줄을 메시지 맨 위에 붙일 입력으로 만든다. 비면 {}라 머리 줄 없이 보낸다.
// after는 머리 줄 아래에 이어 붙일 본문이다(머리 줄이 비어도 본문은 그대로 보낸다).
export async function messageHeadInput({
  serverId,
  key,
  values,
  userMentions,
  after,
}: {
  serverId: string;
  key: MessageCaseKey;
  values: Record<string, string | undefined>;
  userMentions?: string[];
  after?: string;
}): Promise<Pick<DiscordMessageInput, "content" | "userMentions" | "roleMentions">> {
  const heads = await getMessageHeads({ serverId });
  const head = renderMessageHead({ template: heads[key].headLine, values });
  const content = [head, after].filter(Boolean).join("\n") || undefined;
  if (!content) return {};
  return { content, userMentions, roleMentions: roleMentionIds(head) };
}
