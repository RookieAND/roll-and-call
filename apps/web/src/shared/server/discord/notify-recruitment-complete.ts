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
import { isString } from "es-toolkit";

import { formatGameSchedule } from "@/shared/lib";

type RecruitmentPlayer = { username: string; discordId: string | null };

export async function notifyRecruitmentComplete({
  server,
  game,
  gmName,
  gmDiscordId,
  players,
  waitingCount,
}: {
  server: Server;
  game: Game;
  gmName: string;
  gmDiscordId: string | null;
  players: RecruitmentPlayer[];
  waitingCount: number;
}) {
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
          "GM 멘션": gmDiscordId ? `<@${gmDiscordId}>` : `**${gmName}**`,
          "참여자 멘션": playerMentions.join(" "),
        },
        // 참여자 명단은 본문 멘션 줄이 맡는다. 머리 줄이 두 변수를 쓰지 않아도 GM과 참여자는 빠짐없이 알린다.
        alsoMention: [
          { id: gmDiscordId, fallback: `**${gmName}**` },
          ...players.map((player) => ({
            id: player.discordId,
            fallback: `**${player.username}**`,
          })),
        ],
        userMentions: [gmDiscordId, ...players.map((player) => player.discordId)].filter(isString),
      })),
    },
  });
}
