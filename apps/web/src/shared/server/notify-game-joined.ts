import { sendDiscordMessage, DISCORD_COLOR } from "@trpg/discord";
import type { DiscordEmbed } from "@trpg/discord";

import { gameUrl } from "./game-url";
import type { Game } from "./schema";

type JoinInfo = {
  applicantName: string;
  gmName: string;
  confirmedCount: number;
  waitingCount: number;
  isWaiting: boolean;
};

export async function notifyGameJoined(
  game: Game,
  { applicantName, gmName, confirmedCount, waitingCount, isWaiting }: JoinInfo,
) {
  if (!game.discordThreadId) return;

  const fields = [
    { name: "상태", value: isWaiting ? "⏳ 대기열" : "✅ 확정", inline: true },
    { name: "현재 인원", value: `${confirmedCount}/${game.maxPlayers}`, inline: true },
  ];
  if (isWaiting) fields.push({ name: "대기 인원", value: `${waitingCount}명`, inline: true });

  const embed: DiscordEmbed = {
    title: `${isWaiting ? "⏳" : "🙋"} ${game.title}`,
    url: gameUrl(game.id),
    description: isWaiting
      ? `**${applicantName}**님이 대기열에 등록했어요.`
      : `**${applicantName}**님이 참여했어요.`,
    color: isWaiting ? DISCORD_COLOR.waiting : DISCORD_COLOR.confirmed,
    fields,
    footer: { text: `GM ${gmName}` },
    timestamp: new Date().toISOString(),
  };

  await sendDiscordMessage(game.discordThreadId, { embeds: [embed] });
}
