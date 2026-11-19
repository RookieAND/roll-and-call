import { getGameAvailabilities } from "./get-game-availabilities";
import { getUserConfirmedSlots } from "./get-user-confirmed-slots";

export async function getScheduleAvailabilityRows({
  serverId,
  gameId,
  userId,
  roundNo,
}: {
  serverId: string;
  gameId: string;
  userId: string | null;
  roundNo?: number;
}) {
  const [availabilities, blocked] = await Promise.all([
    getGameAvailabilities({ serverId, gameId, roundNo }),
    userId ? getUserConfirmedSlots({ serverId, userId, excludeGameId: gameId }) : [],
  ]);
  return { availabilities, blocked };
}
