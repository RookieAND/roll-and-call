import type { Server } from "@roll-and-call/database";
import {
  getMessageHeads,
  type MessageCaseKey,
  renderMessageHead,
  roleMentionIds,
} from "@roll-and-call/database/servers";
import type { DiscordMessageInput } from "@roll-and-call/discord";
import { compact, uniq } from "es-toolkit";

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
  defaultHead,
  alsoMention,
}: {
  serverId: string;
  key: MessageCaseKey;
  values: Record<string, string | undefined>;
  userMentions?: string[];
  after?: string;
  // 서버가 이 경우의 머리 줄을 저장하지 않았을 때만 기본 머리 줄 대신 쓴다. 저장했으면 그 문구가 우선한다.
  defaultHead?: string;
  // 이 메시지가 반드시 알려야 하는 사람들. 서버가 정한 머리 줄이 이미 멘션한 사람은 건너뛰고, 빠진 사람만 한 줄로 덧붙인다.
  // id가 없으면(디스코드 계정을 모르면) fallback 글자를 대신 적는다.
  alsoMention?: { id: string | null | undefined; fallback?: string }[];
}): Promise<Pick<DiscordMessageInput, "content" | "userMentions" | "roleMentions">> {
  const heads = await getMessageHeads({ serverId });
  const saved = heads[key];
  const template = saved.updatedAt === null && defaultHead ? defaultHead : saved.headLine;
  const head = renderMessageHead({ template, values });
  const written = [head, after].filter(Boolean).join("\n");
  const tokens = (alsoMention ?? []).flatMap(({ id, fallback }) => {
    const token = id ? `<@${id}>` : fallback;
    return token ? [{ id, token }] : [];
  });
  const missing = uniq(tokens.map(({ token }) => token)).filter(
    (token) => !written.includes(token),
  );
  const content = [written, missing.join(" ")].filter(Boolean).join("\n") || undefined;
  if (!content) return {};
  const mentioned = uniq([...(userMentions ?? []), ...compact(tokens.map(({ id }) => id))]);
  return {
    content,
    userMentions: mentioned.length > 0 ? mentioned : undefined,
    roleMentions: roleMentionIds(head),
  };
}
