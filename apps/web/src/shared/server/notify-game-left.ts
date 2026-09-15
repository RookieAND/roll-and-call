import { sendDiscordMessage, DISCORD_COLOR } from "@trpg/discord";
import type { DiscordEmbed } from "@trpg/discord";

import { countConfirmedParticipants } from "./count-confirmed-participants";
import { db } from "./db";
import { gameUrl } from "./game-url";

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
  const embed: DiscordEmbed = {
    title: `🚪 ${game.title}`,
    url: gameUrl(game.id),
    description: removedByGm
      ? `**${name}**님이 참여 목록에서 제외됐어요.`
      : `**${name}**님이 참여를 취소했어요.`,
    color: DISCORD_COLOR.left,
    fields: [
      {
        name: "현재 인원",
        value: `${countConfirmedParticipants(game.participants)}/${game.maxPlayers}`,
        inline: true,
      },
    ],
    footer: { text: `GM ${game.gm?.username ?? "?"}` },
    timestamp: new Date().toISOString(),
  };

  await sendDiscordMessage(game.discordThreadId, { embeds: [embed] });
}
