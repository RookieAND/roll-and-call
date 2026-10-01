import { db, profiles } from "@roll-and-call/database";
import { countConfirmed, countWaiting } from "@roll-and-call/database/rules";
import { sendDiscordMessage, DISCORD_COLOR } from "@roll-and-call/discord";
import { inArray } from "drizzle-orm";

import { getGameForNotice } from "../db/get-game-for-notice";
import { gameNoticeEmbed } from "./game-notice-embed";
import { headcountFields } from "./headcount-fields";

export async function notifyDirectConfirmed({
  gameId,
  userIds,
}: {
  gameId: string;
  userIds: readonly string[];
}) {
  if (userIds.length === 0) return;

  const [game, invited] = await Promise.all([
    getGameForNotice(gameId),
    db
      .select({ username: profiles.username })
      .from(profiles)
      .where(inArray(profiles.id, [...userIds])),
  ]);
  if (!game?.discordThreadId || invited.length === 0) return;

  const names = invited.map((player) => `**${player.username}**`).join(", ");

  const embed = gameNoticeEmbed({
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
