import { type Server } from "@roll-and-call/database";
import { getGameForNotice } from "@roll-and-call/database/games";
import { countConfirmed, countWaiting } from "@roll-and-call/database/games/model";
import { getUsernames } from "@roll-and-call/database/profiles";
import { sendDiscordMessage, DISCORD_COLOR } from "@roll-and-call/discord";
import { gameNoticeEmbed } from "@roll-and-call/game-notices";
import { headcountFields } from "@roll-and-call/game-notices";

export async function notifyDirectConfirmed({
  server,
  gameId,
  userIds,
}: {
  server: Server;
  gameId: string;
  userIds: readonly string[];
}) {
  if (userIds.length === 0) return;

  const [game, invitedNames] = await Promise.all([
    getGameForNotice({ serverId: server.id, gameId }),
    getUsernames(userIds),
  ]);
  if (!game?.discordThreadId || invitedNames.length === 0) return;

  const names = invitedNames.map((username) => `**${username}**`).join(", ");

  const embed = gameNoticeEmbed({
    slug: server.slug,
    game,
    gmName: game.gm?.username ?? "?",
    emoji: "✅",
    color: DISCORD_COLOR.confirmed,
    description: `GM이 ${names}님을 참여자로 확정했어요.`,
    fields: headcountFields({
      game,
      confirmedCount: countConfirmed(game.participants),
      waitingCount: countWaiting(game.participants),
    }),
  });

  await sendDiscordMessage({ channelId: game.discordThreadId, input: { embeds: [embed] } });
}
