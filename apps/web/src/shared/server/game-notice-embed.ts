import type { Game } from "@trpg/database";
import type { DiscordEmbed, DiscordEmbedField } from "@trpg/discord";

import { gameUrl } from "./game-url";

type GameNotice = {
  game: Pick<Game, "id" | "title">;
  gmName: string;
  emoji: string;
  color: number;
  description: string;
  fields?: DiscordEmbedField[];
  linked?: boolean;
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
}: GameNotice): DiscordEmbed {
  return {
    title: `${emoji} ${game.title}`,
    url: linked ? gameUrl(game.id) : undefined,
    description,
    color,
    fields,
    footer: { text: `GM ${gmName}` },
    timestamp: new Date().toISOString(),
  };
}
