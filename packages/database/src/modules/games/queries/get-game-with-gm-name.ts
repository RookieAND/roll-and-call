import { db } from "#/client";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";

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
