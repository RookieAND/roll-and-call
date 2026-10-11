import type { Game } from "@roll-and-call/database";
import type { DiscordEmbed, DiscordEmbedField } from "@roll-and-call/discord";

import { gameUrl } from "./game-url";

type GameNotice = {
  slug: string;
  game: Pick<Game, "id" | "title">;
  gmName: string;
  emoji: string;
  color: number;
  // 본문 알림 줄이 같은 말을 하면 비워 둔다(같은 문장이 임베드와 본문에 두 번 나오지 않게).
  description?: string;
  fields?: DiscordEmbedField[];
  linked?: boolean;
  url?: string;
};

export function gameNoticeEmbed({
  slug,
  game,
  gmName,
  emoji,
  color,
  description,
  fields,
  linked = true,
  url = gameUrl({ slug, gameId: game.id }),
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
