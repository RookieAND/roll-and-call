import { editDiscordMessage, renameDiscordThread } from "@roll-and-call/discord";

import { countConfirmed } from "@/shared/lib";

import { getGameForNotice } from "../db/get-game-for-notice";
import { discordChannelId } from "./discord-channel-id";
import { recruitButtons } from "./recruit-buttons";
import { recruitEmbed } from "./recruit-embed";

export async function refreshRecruitPost(gameId: string) {
  const game = await getGameForNotice(gameId);
  if (!game?.discordThreadId) return;

  await Promise.all([
    editDiscordMessage(discordChannelId("recruit"), game.discordThreadId, {
      embeds: [recruitEmbed(game, game.gm?.username ?? "?", countConfirmed(game.participants))],
      buttons: recruitButtons(game.id),
    }),
    renameDiscordThread(game.discordThreadId, game.title),
  ]);
}
