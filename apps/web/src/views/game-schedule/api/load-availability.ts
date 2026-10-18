import { getScheduleAvailabilityRows } from "@roll-and-call/database/games";

import { aggregateAvailability, type ScheduleAvailability } from "@/entities/availability";
import { getCurrentServer } from "@/shared/server";

export async function getScheduleAvailability({
  gameId,
  userId,
}: {
  gameId: string;
  userId: string | null;
}): Promise<ScheduleAvailability> {
  const server = await getCurrentServer();
  const { availabilities, blocked } = await getScheduleAvailabilityRows({
    serverId: server.id,
    gameId,
    userId,
  });
  return { aggregate: aggregateAvailability({ avails: availabilities, userId }), blocked };
}
