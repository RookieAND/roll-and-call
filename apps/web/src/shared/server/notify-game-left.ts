import { db } from "@trpg/database";
import { sendDiscordMessage, DISCORD_COLOR } from "@trpg/discord";

import { countConfirmedParticipants } from "./count-confirmed-participants";
import { countWaitingParticipants } from "./count-waiting-participants";
import { gameNoticeEmbed } from "./game-notice-embed";
import { headcountFields } from "./headcount-fields";

// 삭제 후에 불러야 현재 인원이 맞다.
export async function notifyGameLeft(gameId: string, userId: string, removedByGm: boolean) {
  const [game, user] = await Promise.all([
    db.query.games.findFirst({
      where: (gameRow, { eq }) => eq(gameRow.id, gameId),
      with: {
        gm: { columns: { username: true } },
        participants: { columns: { status: true } },
      },
    }),
    db.query.profiles.findFirst({
      where: (profile, { eq }) => eq(profile.id, userId),
      columns: { username: true },
    }),
  ]);
  if (!game?.discordThreadId) return;

  const name = user?.username ?? "?";
  const embed = gameNoticeEmbed({
    game,
    gmName: game.gm?.username ?? "?",
    emoji: "🚪",
    color: DISCORD_COLOR.left,
    description: removedByGm
      ? `**${name}**님이 참여 목록에서 제외됐어요.`
      : `**${name}**님이 참여를 취소했어요.`,
    fields: headcountFields(
      game,
      countConfirmedParticipants(game.participants),
      countWaitingParticipants(game.participants),
    ),
  });

  await sendDiscordMessage(game.discordThreadId, { embeds: [embed] });
}
