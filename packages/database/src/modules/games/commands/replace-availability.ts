import { and, eq } from "drizzle-orm";

import { db } from "#/client";
import { availabilities } from "#/schema";

export async function replaceAvailability({
  serverId,
  gameId,
  userId,
  slotStarts,
}: {
  serverId: string;
  gameId: string;
  userId: string;
  slotStarts: Date[];
}) {
  await db.transaction(async (transaction) => {
    await transaction
      .delete(availabilities)
      .where(
        and(
          eq(availabilities.serverId, serverId),
          eq(availabilities.gameId, gameId),
          eq(availabilities.userId, userId),
        ),
      );
    if (slotStarts.length > 0) {
      await transaction
        .insert(availabilities)
        .values(slotStarts.map((slotStart) => ({ serverId, gameId, userId, slotStart })));
    }
  });
}
