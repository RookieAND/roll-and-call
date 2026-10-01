import { countConfirmed } from "@roll-and-call/database/rules";
import { getGameForNotice, type Server } from "@roll-and-call/database/web";
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
            game,
            gmName: game.gm?.username ?? "?",
            confirmedCount: countConfirmed(game.participants),
          }),
        ],
        buttons: recruitButtons(game.id),
      },
    }),
    renameDiscordThread({ threadId: game.discordThreadId, name: game.title }),
  ]);
}
