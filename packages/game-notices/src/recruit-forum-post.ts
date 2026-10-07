import type { Game, Server } from "@roll-and-call/database";
import { getDiscordId } from "@roll-and-call/database/profiles";
import {
  FOLLOW_UP_MARK,
  type DiscordLinkButton,
  type DiscordMessageInput,
} from "@roll-and-call/discord";

import { gameUrl } from "./game-url";
import { gameHeadValues, messageHeadInput } from "./message-head-input";
import { recruitButtons } from "./recruit-buttons";
import { recruitPlainText } from "./recruit-plain-text";

const MESSAGE_LIMIT = 2000;

// 포럼 모집 글의 첫 메시지(머리 줄 + 평문 본문 + 버튼)와 거기 다 못 담은 이어 쓸 조각.
export async function recruitForumPost({
  server,
  game,
  gmName,
  confirmedCount,
  cancelled = false,
}: {
  server: Server;
  game: Game;
  gmName: string;
  confirmedCount: number;
  cancelled?: boolean;
}): Promise<{
  input: DiscordMessageInput;
  followUps: string[];
  followUpButtons: DiscordLinkButton[];
}> {
  const gmDiscordId = await getDiscordId(game.gmId);
  const head = await messageHeadInput({
    serverId: server.id,
    key: "open",
    values: gameHeadValues({ server, game, gmName }),
  });
  const reserved = Math.max((head.content?.length ?? 0) + 1, FOLLOW_UP_MARK.length + 1);
  const { content, followUps } = recruitPlainText({
    game,
    // 본문에서는 GM을 멘션으로 보인다. 디스코드 계정을 모르면 닉네임 그대로.
    gmName: gmDiscordId ? `<@${gmDiscordId}>` : gmName,
    confirmedCount,
    cancelled,
    url: cancelled ? undefined : gameUrl({ slug: server.slug, gameId: game.id }),
    limit: MESSAGE_LIMIT - reserved,
  });
  const buttons = cancelled ? [] : recruitButtons({ slug: server.slug, gameId: game.id });
  // 스포일러 썸네일은 임베드 이미지를 가릴 수 없어 싣지 않는다.
  const thumbnail = game.thumbnailUrl && !game.thumbnailSpoiler ? game.thumbnailUrl : undefined;
  return {
    input: {
      ...head,
      content: [head.content, content].filter(Boolean).join("\n"),
      embeds: thumbnail ? [{ image: { url: thumbnail } }] : [],
      // 버튼은 본문의 맨 끝 메시지에 둔다.
      buttons: followUps.length > 0 ? [] : buttons,
    },
    followUps,
    followUpButtons: buttons,
  };
}
