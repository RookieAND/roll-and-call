import { DISCORD_COLOR } from "@trpg/discord";
import type { DiscordEmbed } from "@trpg/discord";

import { formatGameSchedule, formatMonthDay } from "@/shared/lib";

import { discordOverview } from "./discord-overview";
import { gameUrl } from "./game-url";
import type { Game } from "./schema";

export function recruitEmbed(game: Game, gmName: string, confirmedCount: number): DiscordEmbed {
  const url = gameUrl(game.id);
  const fields = [
    { name: "📜 사용 룰", value: game.rule, inline: true },
    { name: "👥 인원", value: `${confirmedCount}/${game.maxPlayers}명`, inline: true },
    { name: "🕒 시간", value: formatGameSchedule(game), inline: false },
  ];
  // 메시지 버튼(component)은 인터랙션 엔드포인트가 필요해서 마스크드 링크를 CTA로 쓴다.
  if (url) fields.push({ name: "​", value: `**[▶ 참여하러 가기](${url})**`, inline: false });

  return {
    title: `🎲 ${game.title}`,
    url,
    description: discordOverview(game.synopsis),
    color: DISCORD_COLOR.recruit,
    fields,
    image: game.thumbnailUrl ? { url: game.thumbnailUrl } : undefined,
    footer: { text: `GM ${gmName} · 마감 ${formatMonthDay(game.endDate)}` },
    timestamp: game.createdAt.toISOString(),
  };
}
