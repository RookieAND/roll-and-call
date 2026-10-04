import { db } from "#/client";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";

export async function getGameAvailabilities({
  serverId,
  gameId,
}: {
  serverId: string;
  gameId: string;
}) {
  return db.query.availabilities.findMany({
    where: (availability, { and, eq }) =>
      and(eq(availability.serverId, serverId), eq(availability.gameId, gameId)),
    with: { user: { columns: {}, extras: { username: memberNicknameSql(serverId) } } },
  });
}
