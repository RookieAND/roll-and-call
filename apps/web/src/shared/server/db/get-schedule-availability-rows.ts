import "server-only";
import { getGameAvailabilities } from "./get-game-availabilities";
import { getUserConfirmedSlots } from "./get-user-confirmed-slots";

export async function getScheduleAvailabilityRows(gameId: string, userId: string | null) {
  const [availabilities, blocked] = await Promise.all([
    getGameAvailabilities(gameId),
    userId ? getUserConfirmedSlots(userId, gameId) : [],
  ]);
  return { availabilities, blocked };
}
