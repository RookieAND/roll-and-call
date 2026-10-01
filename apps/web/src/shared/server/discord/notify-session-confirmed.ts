import { countConfirmed, countWaiting } from "@roll-and-call/database/rules";
import { sendDiscordMessage, DISCORD_COLOR } from "@roll-and-call/discord";

import { formatDateTime } from "@/shared/lib";

import { getGameForNotice } from "../db/get-game-for-notice";
import { gameNoticeEmbed } from "./game-notice-embed";
import { headcountFields } from "./headcount-fields";

// 확정 뒤에 부른다. 같은 시간으로 다시 확정하면 보내지 않는다.
export async function notifySessionConfirmed({
  gameId,
  previousConfirmedAt,
}: {
  gameId: string;
  previousConfirmedAt: Date | null;
}) {
  const game = await getGameForNotice(gameId);
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
    game,
    gmName: game.gm?.username ?? "?",
    emoji: "🗓️",
    color: DISCORD_COLOR.confirmed,
    description: previousConfirmedAt ? "세션 시간이 변경됐어요." : "세션 시간이 확정됐어요.",
    fields,
  });

  await sendDiscordMessage({ channelId: game.discordThreadId, input: { embeds: [embed] } });
}
