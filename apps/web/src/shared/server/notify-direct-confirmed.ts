import { db, profiles } from "@trpg/database";
import { sendDiscordMessage, DISCORD_COLOR } from "@trpg/discord";
import type { DiscordEmbed } from "@trpg/discord";
import { inArray } from "drizzle-orm";

import { gameUrl } from "./game-url";

// GM이 신청 없이 바로 확정한 사람을 스레드에 알린다. 본인이 알아야 하므로 멘션한다.
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
      .select({ username: profiles.username, discordId: profiles.discordId })
      .from(profiles)
      .where(inArray(profiles.id, [...userIds])),
  ]);
  if (!game?.discordThreadId || invited.length === 0) return;

  const confirmedCount = game.participants.filter(
    (participant) => participant.status === "confirmed",
  ).length;
  const mentionIds = invited.map((player) => player.discordId).filter((id) => id !== null);
  const names = invited.map((player) => `**${player.username}**`).join(", ");

  const embed: DiscordEmbed = {
    title: `✅ ${game.title}`,
    url: gameUrl(game.id),
    description: `GM이 ${names}님을 참여자로 확정했어요.`,
    color: DISCORD_COLOR.confirmed,
    fields: [
      { name: "상태", value: "✅ 직접 확정", inline: true },
      { name: "현재 인원", value: `${confirmedCount}/${game.maxPlayers}`, inline: true },
    ],
    footer: { text: `GM ${game.gm?.username ?? "?"}` },
    timestamp: new Date().toISOString(),
  };

  await sendDiscordMessage(game.discordThreadId, {
    content: mentionIds.map((discordId) => `<@${discordId}>`).join(" ") || undefined,
    embeds: [embed],
    userMentions: mentionIds,
  });
}
