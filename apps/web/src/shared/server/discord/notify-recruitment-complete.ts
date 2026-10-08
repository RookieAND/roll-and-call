import type { Game } from "@roll-and-call/database";
import type { Server } from "@roll-and-call/database";
import { sendDiscordMessage, DISCORD_COLOR } from "@roll-and-call/discord";
import {
  gameHeadValues,
  gameNoticeEmbed,
  messageHeadInput,
  messageText,
} from "@roll-and-call/game-notices";
import { headcountFields } from "@roll-and-call/game-notices";

import { formatGameSchedule } from "@/shared/lib";

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
  const playerNames = players.map((player) => `**${player.username}**`);
  const playerMentions = players.map((player) =>
    player.discordId ? `<@${player.discordId}>` : `**${player.username}**`,
  );

  const embed = gameNoticeEmbed({
    slug: server.slug,
    game,
    gmName,
    emoji: "🎉",
    color: DISCORD_COLOR.complete,
    description: await messageText({
      serverId: server.id,
      key: "done",
      values: gameHeadValues({ server, game, gmName }),
    }),
    fields: [
      { name: "📜 룰", value: game.rule, inline: true },
      ...headcountFields({ game, confirmedCount: players.length, waitingCount }),
      { name: "🕒 시간", value: formatGameSchedule(game), inline: false },
      // Discord field value 상한 1024자
      { name: "🙋 참여자", value: playerNames.join(", ").slice(0, 1024) || "-", inline: false },
    ],
  });

  await sendDiscordMessage({
    channelId: server.closedChannelId,
    input: {
      embeds: [embed],
      ...(await messageHeadInput({
        serverId: server.id,
        key: "done",
        values: {
          ...gameHeadValues({ server, game, gmName }),
          "참여자 멘션": playerMentions.join(" "),
        },
        userMentions: players.flatMap((player) => player.discordId ?? []),
      })),
    },
  });
}
