import type { Game } from "@trpg/database";
import { sendDiscordMessage, DISCORD_COLOR } from "@trpg/discord";

import { formatGameSchedule } from "@/shared/lib";

import { discordChannelId } from "./discord-channel-id";
import { gameNoticeEmbed } from "./game-notice-embed";
import { headcountFields } from "./headcount-fields";

export type RecruitmentPlayer = { username: string; discordId: string | null };

export async function notifyRecruitmentComplete(
  game: Game,
  gmName: string,
  players: RecruitmentPlayer[],
) {
  const mentionIds = players.map((player) => player.discordId).filter((id) => id !== null);
  const playerLabels = players.map((player) =>
    player.discordId ? `<@${player.discordId}>` : `**${player.username}**`,
  );

  const embed = gameNoticeEmbed({
    game,
    gmName,
    emoji: "🎉",
    color: DISCORD_COLOR.complete,
    description: "구인이 완료됐어요!",
    fields: [
      { name: "📜 룰", value: game.rule, inline: true },
      ...headcountFields(players.length, game.maxPlayers),
      { name: "🕒 시간", value: formatGameSchedule(game), inline: false },
      // Discord field value 상한 1024자
      { name: "🙋 참여자", value: playerLabels.join(", ").slice(0, 1024) || "-", inline: false },
    ],
  });

  await sendDiscordMessage(discordChannelId("closed"), {
    content: mentionIds.map((discordId) => `<@${discordId}>`).join(" ") || undefined,
    embeds: [embed],
    userMentions: mentionIds,
  });
}
