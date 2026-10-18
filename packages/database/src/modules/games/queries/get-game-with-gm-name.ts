import { db } from "#db/client";
import { memberNicknameSql } from "#db/modules/profiles";

export async function getGameWithGmName({
  serverId,
  gameId,
}: {
  serverId: string;
  gameId: string;
}) {
  return db.query.games.findFirst({
    where: (game, { and, eq }) => and(eq(game.serverId, serverId), eq(game.id, gameId)),
    with: { gm: { columns: {}, extras: { username: memberNicknameSql(serverId) } } },
  });
}
