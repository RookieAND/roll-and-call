import type { Game } from "@roll-and-call/database";
import { RECRUIT_METHOD_LABEL } from "@roll-and-call/database/games/model";
import { DISCORD_COLOR, type DiscordEmbed } from "@roll-and-call/discord";

import { discordOverview } from "./discord-overview";
import { gameUrl } from "./game-url";
import { formatGameSchedule } from "./lib/format-game-schedule";
import { formatMonthDay } from "./lib/format-month-day";
import { formatRecruitHeadcount } from "./lib/format-recruit-headcount";
import { recruitEmbedImage } from "./recruit-embed-image";

// cancelled면 글은 그 자리에 남기고 빨갛게 바꾼다 — 들어갈 곳이 없어졌으니 링크는 뺀다. CTA는 recruitButtons.
export function recruitEmbed({
  slug,
  game,
  gmName,
  confirmedCount,
  cancelled = false,
}: {
  slug: string;
  game: Game;
  gmName: string;
  confirmedCount: number;
  cancelled?: boolean;
}): DiscordEmbed {
  const url = cancelled ? undefined : gameUrl({ slug, gameId: game.id });
  const fields = [
    { name: "📜 룰", value: game.rule, inline: true },
    { name: "👥 인원", value: formatRecruitHeadcount({ game, confirmedCount }), inline: true },
    { name: "🎯 방식", value: RECRUIT_METHOD_LABEL[game.recruitMethod], inline: true },
    { name: "🎙️ 진행", value: game.playType === "text" ? "텍스트" : "보이스", inline: true },
    { name: "🕒 시간", value: formatGameSchedule(game), inline: false },
  ];

  return {
    title: cancelled ? `🚫 ${game.title} (취소됨)` : `🎲 ${game.title}`,
    url,
    description: discordOverview(game.synopsis),
    color: cancelled ? DISCORD_COLOR.cancelled : DISCORD_COLOR.recruit,
    fields,
    image: recruitEmbedImage(game),
    footer: { text: `GM ${gmName} · 마감 ${formatMonthDay(game.endDate)}` },
    timestamp: game.createdAt.toISOString(),
  };
}
