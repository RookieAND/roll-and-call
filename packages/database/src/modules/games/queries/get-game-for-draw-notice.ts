import { db } from "#db/client";
import { memberNicknameSql } from "#db/modules/profiles";

export async function getGameForDrawNotice({
  serverId,
  gameId,
}: {
  serverId: string;
  gameId: string;
}) {
  return db.query.games.findFirst({
    where: (game, { and, eq }) => and(eq(game.serverId, serverId), eq(game.id, gameId)),
    with: {
      gm: { columns: {}, extras: { username: memberNicknameSql(serverId) } },
      participants: {
        columns: { userId: true, status: true, drawRank: true, joinedAt: true, waitlistedAt: true },
        where: (participant, { eq }) => eq(participant.serverId, serverId),
        with: {
          user: { columns: { discordId: true }, extras: { username: memberNicknameSql(serverId) } },
        },
      },
    },
  });
}
