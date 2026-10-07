import { type Server } from "@roll-and-call/database";
import { getGameForNotice } from "@roll-and-call/database/games";
import { countConfirmed, countWaiting } from "@roll-and-call/database/games/model";
import { sendDiscordMessage, DISCORD_COLOR } from "@roll-and-call/discord";
import {
  gameHeadValues,
  gameNoticeEmbed,
  messageHeadInput,
  messageText,
} from "@roll-and-call/game-notices";
import { headcountFields, memberMention } from "@roll-and-call/game-notices";

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
    Promise.all(userIds.map(memberMention)),
  ]);
  if (!game?.discordThreadId || invitedNames.length === 0) return;

  const names = invitedNames.join(", ");
  const embed = gameNoticeEmbed({
    slug: server.slug,
    game,
    gmName: game.gm?.username ?? "?",
    emoji: "✅",
    color: DISCORD_COLOR.confirmed,
    description: await messageText({
      serverId: server.id,
      key: "direct",
      values: {
        ...gameHeadValues({ server, game, gmName: game.gm?.username ?? "?" }),
        확정자: names,
      },
    }),
    fields: headcountFields({
      game,
      confirmedCount: countConfirmed(game.participants),
      waitingCount: countWaiting(game.participants),
    }),
  });

  await sendDiscordMessage({
    channelId: game.discordThreadId,
    input: {
      embeds: [embed],
      ...(await messageHeadInput({
        serverId: server.id,
        key: "direct",
        values: gameHeadValues({ server, game, gmName: game.gm?.username ?? "?" }),
      })),
    },
  });
}
