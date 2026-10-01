import { and, eq } from "drizzle-orm";

import { db } from "../../client";
import { availabilities } from "../../schema";

export async function hasAnsweredAvailability({
  serverId,
  gameId,
  userId,
}: {
  serverId: string;
  gameId: string;
  userId: string;
}) {
  const answered = await db.$count(
    availabilities,
    and(
      eq(availabilities.serverId, serverId),
      eq(availabilities.gameId, gameId),
      eq(availabilities.userId, userId),
    ),
  );
  return answered > 0;
}
