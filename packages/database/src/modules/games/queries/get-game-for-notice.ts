import { db } from "#/client";

export async function getGameForNotice({ serverId, gameId }: { serverId: string; gameId: string }) {
  return db.query.games.findFirst({
    where: (game, { and, eq }) => and(eq(game.serverId, serverId), eq(game.id, gameId)),
    with: {
      gm: { columns: { username: true } },
      participants: {
        columns: { status: true },
        where: (participant, { eq }) => eq(participant.serverId, serverId),
      },
    },
  });
}
