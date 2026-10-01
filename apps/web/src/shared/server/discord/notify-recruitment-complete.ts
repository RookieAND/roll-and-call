import type { Game } from "@roll-and-call/database";
import type { Server } from "@roll-and-call/database/web";
import { sendDiscordMessage, DISCORD_COLOR } from "@roll-and-call/discord";

import { formatGameSchedule } from "@/shared/lib";

import { gameNoticeEmbed } from "./game-notice-embed";
import { headcountFields } from "./headcount-fields";

type RecruitmentPlayer = { username: string; discordId: string | null };

export async function notifyRecruitmentComplete({
  server,
  game,
  gmName,
  players,
  waitingCount,
}: {
  server: Server;
  game: Game;
  gmName: string;
  players: RecruitmentPlayer[];
  waitingCount: number;
}) {
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
      ...headcountFields({ game, confirmedCount: players.length, waitingCount }),
      { name: "🕒 시간", value: formatGameSchedule(game), inline: false },
      // Discord field value 상한 1024자
      { name: "🙋 참여자", value: playerLabels.join(", ").slice(0, 1024) || "-", inline: false },
    ],
  });

  await sendDiscordMessage({ channelId: server.closedChannelId, input: { embeds: [embed] } });
}
