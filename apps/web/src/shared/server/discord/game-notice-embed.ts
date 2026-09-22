import type { Game } from "@roll-and-call/database";
import type { DiscordEmbed, DiscordEmbedField } from "@roll-and-call/discord";

import { gameUrl } from "../game-url";

type GameNotice = {
  game: Pick<Game, "id" | "title">;
  gmName: string;
  emoji: string;
  color: number;
  description: string;
  fields?: DiscordEmbedField[];
  linked?: boolean;
  url?: string;
};

// 게임 알림 공통 양식: 제목은 "이모지 게임명", 무슨 일인지는 description 한 문장, 수치는 fields.
export function gameNoticeEmbed({
  game,
  gmName,
  emoji,
  color,
  description,
  fields,
  linked = true,
  url = gameUrl(game.id),
}: GameNotice): DiscordEmbed {
  return {
    title: `${emoji} ${game.title}`,
    url: linked ? url : undefined,
    description,
    color,
    fields,
    footer: { text: `GM ${gmName}` },
    timestamp: new Date().toISOString(),
  };
}
