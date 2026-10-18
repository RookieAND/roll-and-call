import { and, eq } from "drizzle-orm";

import { db } from "#db/client";
import type { Transaction } from "#db/modules/transaction";
import { availabilities } from "#db/schema";

export async function replaceAvailability({
  transaction: outer,
  serverId,
  gameId,
  userId,
  slotStarts,
}: {
  transaction?: Transaction;
  serverId: string;
  gameId: string;
  userId: string;
  slotStarts: Date[];
}) {
  await (outer ?? db).transaction(async (transaction) => {
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
