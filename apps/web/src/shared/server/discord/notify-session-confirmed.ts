import { type Server } from "@roll-and-call/database";
import { getGameForNotice } from "@roll-and-call/database/games";
import { countConfirmed, countWaiting } from "@roll-and-call/database/games/model";
import { sendDiscordMessage, DISCORD_COLOR } from "@roll-and-call/discord";
import {
  gameHeadValues,
  gameNoticeEmbed,
  messageHeadInput,
  gameUrl,
  messageText,
} from "@roll-and-call/game-notices";
import { headcountFields } from "@roll-and-call/game-notices";

import { formatDateTime } from "@/shared/lib";

// 확정 뒤에 부른다. 같은 시간으로 다시 확정하면 보내지 않는다.
export async function notifySessionConfirmed({
  server,
  gameId,
  previousConfirmedAt,
}: {
  server: Server;
  gameId: string;
  previousConfirmedAt: Date | null;
}) {
  const game = await getGameForNotice({ serverId: server.id, gameId });
  if (!game?.discordThreadId || !game.confirmedAt) return;
  if (previousConfirmedAt?.getTime() === game.confirmedAt.getTime()) return;

  const fields = [
    { name: "🕒 시간", value: formatDateTime(game.confirmedAt), inline: true },
    ...headcountFields({
      game,
      confirmedCount: countConfirmed(game.participants),
      waitingCount: countWaiting(game.participants),
    }),
  ];
  if (previousConfirmedAt) {
    fields.push({ name: "🕒 이전 시간", value: formatDateTime(previousConfirmedAt), inline: true });
  }

  const embed = gameNoticeEmbed({
    slug: server.slug,
    game,
    gmName: game.gm?.username ?? "?",
    emoji: "🗓️",
    color: DISCORD_COLOR.confirmed,
    description: await messageText({
      serverId: server.id,
      key: previousConfirmedAt ? "time_changed" : "time",
      values: gameHeadValues({ server, game, gmName: game.gm?.username ?? "?" }),
    }),
    fields,
  });

  const sessionUrl = gameUrl({ slug: server.slug, gameId: game.id });
  await sendDiscordMessage({
    channelId: game.discordThreadId,
    input: {
      embeds: [embed],
      ...(await messageHeadInput({
        serverId: server.id,
        key: "time",
        values: gameHeadValues({ server, game, gmName: game.gm?.username ?? "?" }),
      })),
      buttons: sessionUrl ? [{ label: "🕒 세션 확인하기", url: sessionUrl }] : [],
    },
  });
}
