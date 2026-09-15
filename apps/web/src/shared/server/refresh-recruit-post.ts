import { editDiscordMessage, renameDiscordThread } from "@trpg/discord";

import { countConfirmedParticipants } from "./count-confirmed-participants";
import { db } from "./db";
import { discordChannelId } from "./discord-channel-id";
import { recruitEmbed } from "./recruit-embed";

export async function refreshRecruitPost(gameId: string) {
  const game = await db.query.games.findFirst({
    where: (gameRow, { eq }) => eq(gameRow.id, gameId),
    with: {
      gm: { columns: { username: true } },
      participants: { columns: { status: true } },
    },
  });
  if (!game?.discordThreadId) return;

  await Promise.all([
    editDiscordMessage(discordChannelId("recruit"), game.discordThreadId, {
      embeds: [
        recruitEmbed(game, game.gm?.username ?? "?", countConfirmedParticipants(game.participants)),
      ],
    }),
    renameDiscordThread(game.discordThreadId, game.title),
  ]);
}
