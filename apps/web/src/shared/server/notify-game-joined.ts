import type { Game } from "@trpg/database";
import { sendDiscordMessage, DISCORD_COLOR } from "@trpg/discord";

import { gameNoticeEmbed } from "./game-notice-embed";
import { headcountFields } from "./headcount-fields";

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

  const embed = gameNoticeEmbed({
    game,
    gmName,
    emoji: isWaiting ? "⏳" : "🙋",
    color: isWaiting ? DISCORD_COLOR.waiting : DISCORD_COLOR.confirmed,
    description: isWaiting
      ? `**${applicantName}**님이 대기열에 등록했어요.`
      : `**${applicantName}**님이 참여했어요.`,
    fields: headcountFields(confirmedCount, game.maxPlayers, waitingCount),
  });

  await sendDiscordMessage(game.discordThreadId, { embeds: [embed] });
}
