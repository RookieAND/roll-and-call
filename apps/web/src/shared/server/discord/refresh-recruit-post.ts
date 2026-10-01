import { countConfirmed } from "@roll-and-call/database/rules";
import { editDiscordMessage, renameDiscordThread } from "@roll-and-call/discord";

import { getGameForNotice } from "../db/get-game-for-notice";
import { discordChannelId } from "./discord-channel-id";
import { recruitButtons } from "./recruit-buttons";
import { recruitEmbed } from "./recruit-embed";

export async function refreshRecruitPost(gameId: string) {
  const game = await getGameForNotice(gameId);
  if (!game?.discordThreadId) return;

  await Promise.all([
    editDiscordMessage({
      channelId: discordChannelId("recruit"),
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
