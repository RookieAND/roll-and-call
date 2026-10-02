import { type Server } from "@roll-and-call/database";
import { getGameForNotice } from "@roll-and-call/database/games";
import { countConfirmed } from "@roll-and-call/database/games/model";
import { editDiscordMessage, renameDiscordThread } from "@roll-and-call/discord";

import { recruitButtons } from "./recruit-buttons";
import { recruitEmbed } from "./recruit-embed";

export async function refreshRecruitPost({ server, gameId }: { server: Server; gameId: string }) {
  const game = await getGameForNotice({ serverId: server.id, gameId });
  if (!game?.discordThreadId) return;

  await Promise.all([
    editDiscordMessage({
      channelId: server.recruitChannelId,
      messageId: game.discordThreadId,
      input: {
        embeds: [
          recruitEmbed({
            slug: server.slug,
            game,
            gmName: game.gm?.username ?? "?",
            confirmedCount: countConfirmed(game.participants),
          }),
        ],
        buttons: recruitButtons({ slug: server.slug, gameId: game.id }),
      },
    }),
    renameDiscordThread({ threadId: game.discordThreadId, name: game.title }),
  ]);
}
