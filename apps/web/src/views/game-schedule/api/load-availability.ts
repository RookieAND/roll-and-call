import { aggregateAvailability, type ScheduleAvailability } from "@/entities/availability";
import { getGameAvailabilities, getUserConfirmedSlots } from "@/shared/server";

export async function getScheduleAvailability(
  gameId: string,
  userId: string | null,
): Promise<ScheduleAvailability> {
  const [availabilities, blocked] = await Promise.all([
    getGameAvailabilities(gameId),
    userId ? getUserConfirmedSlots(userId, gameId) : [],
  ]);
  return { aggregate: aggregateAvailability({ avails: availabilities, userId }), blocked };
}
