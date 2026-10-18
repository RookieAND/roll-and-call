import { db } from "#db/client";
import { memberNicknameSql } from "#db/modules/profiles";

export async function getGameForRecruitmentNotice({
  serverId,
  gameId,
}: {
  serverId: string;
  gameId: string;
}) {
  return db.query.games.findFirst({
    where: (game, { and, eq }) => and(eq(game.serverId, serverId), eq(game.id, gameId)),
    with: {
      gm: { columns: { discordId: true }, extras: { username: memberNicknameSql(serverId) } },
      participants: {
        columns: { status: true },
        where: (participant, { eq }) => eq(participant.serverId, serverId),
        orderBy: (participant, { asc }) => asc(participant.joinedAt),
        with: {
          user: { columns: { discordId: true }, extras: { username: memberNicknameSql(serverId) } },
        },
      },
    },
  });
}
