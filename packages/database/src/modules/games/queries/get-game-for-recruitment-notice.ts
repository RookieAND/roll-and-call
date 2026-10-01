import { db } from "../../../client";

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
      gm: { columns: { username: true } },
      participants: {
        where: (participant, { eq }) => eq(participant.serverId, serverId),
        orderBy: (participant, { asc }) => asc(participant.joinedAt),
        with: { user: { columns: { username: true, discordId: true } } },
      },
    },
  });
}
