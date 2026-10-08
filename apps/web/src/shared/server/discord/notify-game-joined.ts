import type { Game, Server } from "@roll-and-call/database";
import { sendDiscordMessage, DISCORD_COLOR } from "@roll-and-call/discord";
import {
  gameHeadValues,
  gameNoticeEmbed,
  messageHeadInput,
  messageText,
} from "@roll-and-call/game-notices";
import { headcountFields, memberName, memberNoticeLine } from "@roll-and-call/game-notices";

type JoinInfo = {
  applicantId: string;
  gmName: string;
  confirmedCount: number;
  waitingCount: number;
  isWaiting: boolean;
};

export async function notifyGameJoined({
  server,
  game,
  applicantId,
  gmName,
  confirmedCount,
  waitingCount,
  isWaiting,
}: JoinInfo & { server: Server; game: Game }) {
  if (!game.discordThreadId) return;

  const applicant = await memberName({ serverId: server.id, userId: applicantId });
  const embed = gameNoticeEmbed({
    slug: server.slug,
    game,
    gmName,
    emoji: isWaiting ? "⏳" : "🙋",
    color: isWaiting ? DISCORD_COLOR.waiting : DISCORD_COLOR.confirmed,
    description: await messageText({
      serverId: server.id,
      key: isWaiting ? "apply_waiting" : "apply",
      values: { ...gameHeadValues({ server, game, gmName }), 참여자: applicant },
    }),
    fields: headcountFields({ game, confirmedCount, waitingCount }),
  });

  await sendDiscordMessage({
    channelId: game.discordThreadId,
    input: {
      embeds: [embed],
      ...(await messageHeadInput({
        serverId: server.id,
        key: "apply",
        values: gameHeadValues({ server, game, gmName }),
        ...(await memberNoticeLine({
          serverId: server.id,
          userIds: [applicantId],
          key: isWaiting ? "apply_waiting_line" : "apply_line",
          values: gameHeadValues({ server, game, gmName }),
        })),
      })),
    },
  });
}
