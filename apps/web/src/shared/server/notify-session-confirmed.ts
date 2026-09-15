import { sendDiscordMessage, DISCORD_COLOR } from "@trpg/discord";
import type { DiscordEmbed } from "@trpg/discord";

import { formatDateTime } from "@/shared/lib";

import { countConfirmedParticipants } from "./count-confirmed-participants";
import { db } from "./db";
import { gameUrl } from "./game-url";

// 확정 뒤에 부른다. 같은 시간으로 다시 확정하면 보내지 않는다.
export async function notifySessionConfirmed(gameId: string, previousConfirmedAt: Date | null) {
  const game = await db.query.games.findFirst({
    where: (gameRow, { eq }) => eq(gameRow.id, gameId),
    with: {
      gm: { columns: { username: true } },
      participants: { columns: { status: true } },
    },
  });
  if (!game?.discordThreadId || !game.confirmedAt) return;
  if (previousConfirmedAt?.getTime() === game.confirmedAt.getTime()) return;

  const fields = [
    { name: "🕒 시간", value: formatDateTime(game.confirmedAt), inline: false },
    {
      name: "👥 인원",
      value: `${countConfirmedParticipants(game.participants)}/${game.maxPlayers}`,
      inline: true,
    },
  ];
  if (previousConfirmedAt) {
    fields.push({ name: "이전 시간", value: formatDateTime(previousConfirmedAt), inline: true });
  }

  const embed: DiscordEmbed = {
    title: `🗓️ ${game.title}`,
    url: gameUrl(game.id),
    description: previousConfirmedAt ? "세션 시간이 변경됐어요." : "세션 시간이 확정됐어요.",
    color: DISCORD_COLOR.confirmed,
    fields,
    footer: { text: `GM ${game.gm?.username ?? "?"}` },
    timestamp: new Date().toISOString(),
  };

  await sendDiscordMessage(game.discordThreadId, { embeds: [embed] });
}
