import { db, profiles } from "@trpg/database";
import { sendDiscordMessage, DISCORD_COLOR } from "@trpg/discord";
import { inArray } from "drizzle-orm";

import { countConfirmedParticipants } from "./count-confirmed-participants";
import { countWaitingParticipants } from "./count-waiting-participants";
import { gameNoticeEmbed } from "./game-notice-embed";
import { headcountFields } from "./headcount-fields";

// GM이 신청 없이 바로 확정한 사람을 스레드에 알린다.
export async function notifyDirectConfirmed(gameId: string, userIds: readonly string[]) {
  if (userIds.length === 0) return;

  const [game, invited] = await Promise.all([
    db.query.games.findFirst({
      where: (gameRow, { eq }) => eq(gameRow.id, gameId),
      with: {
        gm: { columns: { username: true } },
        participants: { columns: { status: true } },
      },
    }),
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
    fields: headcountFields(
      game,
      countConfirmedParticipants(game.participants),
      countWaitingParticipants(game.participants),
    ),
  });

  await sendDiscordMessage(game.discordThreadId, { embeds: [embed] });
}
