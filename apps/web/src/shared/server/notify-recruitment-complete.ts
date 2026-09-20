import type { Game } from "@trpg/database";
import { sendDiscordMessage, DISCORD_COLOR } from "@trpg/discord";
import type { DiscordEmbed } from "@trpg/discord";

import { formatGameSchedule } from "@/shared/lib";

import { discordChannelId } from "./discord-channel-id";
import { gameUrl } from "./game-url";

export type RecruitmentPlayer = { username: string; discordId: string | null };

export async function notifyRecruitmentComplete(
  game: Game,
  gmName: string,
  players: RecruitmentPlayer[],
) {
  const mentionIds = players.map((player) => player.discordId).filter((id) => id !== null);
  const playerLabels = players.map((player) =>
    player.discordId ? `<@${player.discordId}>` : player.username,
  );

  const embed: DiscordEmbed = {
    title: `🎉 ${game.title} — 구인 완료!`,
    url: gameUrl(game.id),
    color: DISCORD_COLOR.complete,
    fields: [
      { name: "📜 사용 룰", value: game.rule, inline: true },
      { name: "👥 인원", value: `${game.maxPlayers}/${game.maxPlayers}`, inline: true },
      { name: "🕒 시간", value: formatGameSchedule(game), inline: false },
      // Discord field value 상한 1024자
      { name: "🙋 참여자", value: playerLabels.join(", ").slice(0, 1024) || "-", inline: false },
    ],
    footer: { text: `GM ${gmName}` },
    timestamp: new Date().toISOString(),
  };

  await sendDiscordMessage(discordChannelId("closed"), {
    content: mentionIds.map((discordId) => `<@${discordId}>`).join(" ") || undefined,
    embeds: [embed],
    userMentions: mentionIds,
  });
}
