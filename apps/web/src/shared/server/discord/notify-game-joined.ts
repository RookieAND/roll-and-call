import type { Game, Server } from "@roll-and-call/database";
import { sendDiscordMessage, DISCORD_COLOR } from "@roll-and-call/discord";
import { gameHeadValues, gameNoticeEmbed, messageHeadInput } from "@roll-and-call/game-notices";
import { headcountFields, memberMention } from "@roll-and-call/game-notices";

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

  const applicant = await memberMention(applicantId);
  const embed = gameNoticeEmbed({
    slug: server.slug,
    game,
    gmName,
    emoji: isWaiting ? "⏳" : "🙋",
    color: isWaiting ? DISCORD_COLOR.waiting : DISCORD_COLOR.confirmed,
    description: isWaiting
      ? `${applicant}님이 대기열에 등록했어요.`
      : `${applicant}님이 참여했어요.`,
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
      })),
    },
  });
}
