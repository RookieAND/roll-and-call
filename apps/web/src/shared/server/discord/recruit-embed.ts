import type { Game } from "@roll-and-call/database";
import { DISCORD_COLOR, type DiscordEmbed } from "@roll-and-call/discord";

import { formatGameSchedule, formatMonthDay } from "@/shared/lib";

import { gameUrl } from "../game-url";
import { discordOverview } from "./discord-overview";

// cancelled면 글은 그 자리에 남기고 빨갛게 바꾼다 — 들어갈 곳이 없어졌으니 링크는 뺀다. CTA는 recruitButtons.
export function recruitEmbed(
  game: Game,
  gmName: string,
  confirmedCount: number,
  cancelled = false,
): DiscordEmbed {
  const url = cancelled ? undefined : gameUrl(game.id);
  const fields = [
    { name: "📜 룰", value: game.rule, inline: true },
    { name: "👥 인원", value: `${confirmedCount}/${game.maxPlayers}명`, inline: true },
    { name: "🕒 시간", value: formatGameSchedule(game), inline: false },
  ];

  return {
    title: cancelled ? `🚫 ${game.title} (취소됨)` : `🎲 ${game.title}`,
    url,
    description: discordOverview(game.synopsis),
    color: cancelled ? DISCORD_COLOR.cancelled : DISCORD_COLOR.recruit,
    fields,
    // 디스코드 임베드 이미지는 가릴 수 없어서 스포일러 썸네일은 싣지 않는다.
    image: game.thumbnailUrl && !game.thumbnailSpoiler ? { url: game.thumbnailUrl } : undefined,
    footer: { text: `GM ${gmName} · 마감 ${formatMonthDay(game.endDate)}` },
    timestamp: game.createdAt.toISOString(),
  };
}
