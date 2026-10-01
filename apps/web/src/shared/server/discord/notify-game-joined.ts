import type { Game, Server } from "@roll-and-call/database";
import { sendDiscordMessage, DISCORD_COLOR } from "@roll-and-call/discord";

import { gameNoticeEmbed } from "./game-notice-embed";
import { headcountFields } from "./headcount-fields";

type JoinInfo = {
  applicantName: string;
  gmName: string;
  confirmedCount: number;
  waitingCount: number;
  isWaiting: boolean;
};

export async function notifyGameJoined({
  server,
  game,
  applicantName,
  gmName,
  confirmedCount,
  waitingCount,
  isWaiting,
}: JoinInfo & { server: Server; game: Game }) {
  if (!game.discordThreadId) return;

  const embed = gameNoticeEmbed({
    slug: server.slug,
    game,
    gmName,
    emoji: isWaiting ? "⏳" : "🙋",
    color: isWaiting ? DISCORD_COLOR.waiting : DISCORD_COLOR.confirmed,
    description: isWaiting
      ? `**${applicantName}**님이 대기열에 등록했어요.`
      : `**${applicantName}**님이 참여했어요.`,
    fields: headcountFields({ game, confirmedCount, waitingCount }),
  });

  await sendDiscordMessage({ channelId: game.discordThreadId, input: { embeds: [embed] } });
}
