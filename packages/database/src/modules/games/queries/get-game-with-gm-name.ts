import { db } from "#/client";

export async function getGameWithGmName({
  serverId,
  gameId,
}: {
  serverId: string;
  gameId: string;
}) {
  return db.query.games.findFirst({
    where: (game, { and, eq }) => and(eq(game.serverId, serverId), eq(game.id, gameId)),
    with: { gm: { columns: { username: true } } },
  });
}
