import { getScheduleAvailabilityRows } from "@roll-and-call/database/games";

import { aggregateAvailability, type ScheduleAvailability } from "@/entities/availability";
import { getCurrentServer } from "@/shared/server";

export async function getScheduleAvailability({
  gameId,
  userId,
  roundNo,
}: {
  gameId: string;
  userId: string | null;
  roundNo?: number;
}): Promise<ScheduleAvailability> {
  const server = await getCurrentServer();
  const { availabilities, blocked } = await getScheduleAvailabilityRows({
    serverId: server.id,
    gameId,
    userId,
    roundNo,
  });
  return { aggregate: aggregateAvailability({ avails: availabilities, userId }), blocked };
}
