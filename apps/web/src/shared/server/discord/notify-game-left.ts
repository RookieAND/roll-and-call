import { db } from "@trpg/database";
import { sendDiscordMessage, DISCORD_COLOR } from "@trpg/discord";

import { countConfirmed, countWaiting } from "@/shared/lib";

import { getGameForNotice } from "../db/get-game-for-notice";
import { gameNoticeEmbed } from "./game-notice-embed";
import { headcountFields } from "./headcount-fields";

// 삭제 후에 불러야 현재 인원이 맞다.
export async function notifyGameLeft(gameId: string, userId: string, removedByGm: boolean) {
  const [game, user] = await Promise.all([
    getGameForNotice(gameId),
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
      countConfirmed(game.participants),
      countWaiting(game.participants),
    ),
  });

  await sendDiscordMessage(game.discordThreadId, { embeds: [embed] });
}
