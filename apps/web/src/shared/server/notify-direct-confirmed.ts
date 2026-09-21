import { db, profiles } from "@trpg/database";
import { sendDiscordMessage, DISCORD_COLOR } from "@trpg/discord";
import type { DiscordEmbed } from "@trpg/discord";
import { inArray } from "drizzle-orm";

import { gameUrl } from "./game-url";

// GM이 신청 없이 바로 확정한 사람을 스레드에 알린다. 임베드 안 멘션은 이름만 보이고 알림은 울리지 않는다.
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
  const names = invited
    .map((player) => (player.discordId ? `<@${player.discordId}>` : `**${player.username}**`))
    .join(", ");

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

  await sendDiscordMessage(game.discordThreadId, { embeds: [embed] });
}
