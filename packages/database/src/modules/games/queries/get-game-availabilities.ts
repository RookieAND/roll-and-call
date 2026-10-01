import { db } from "../../../client";

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
    with: { user: { columns: { username: true } } },
  });
}
