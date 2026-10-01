import { aggregateAvailability, type ScheduleAvailability } from "@/entities/availability";
import { getScheduleAvailabilityRows } from "@/shared/server";

export async function getScheduleAvailability({
  gameId,
  userId,
}: {
  gameId: string;
  userId: string | null;
}): Promise<ScheduleAvailability> {
  const { availabilities, blocked } = await getScheduleAvailabilityRows({ gameId, userId });
  return { aggregate: aggregateAvailability({ avails: availabilities, userId }), blocked };
}
