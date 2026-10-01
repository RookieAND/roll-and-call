import { db } from "../../../client";

export async function getGameWithRoster({
  serverId,
  gameId,
}: {
  serverId: string;
  gameId: string;
}) {
  return db.query.games.findFirst({
    where: (game, { and, eq }) => and(eq(game.serverId, serverId), eq(game.id, gameId)),
    with: {
      participants: {
        columns: { userId: true, status: true },
        where: (participant, { eq }) => eq(participant.serverId, serverId),
      },
    },
  });
}
