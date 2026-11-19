import { and, eq } from "drizzle-orm";

import { db } from "#db/client";
import type { Transaction } from "#db/modules/transaction";
import { availabilities } from "#db/schema";

export async function replaceAvailability({
  transaction: outer,
  serverId,
  gameId,
  userId,
  roundNo = 1,
  slotStarts,
}: {
  transaction?: Transaction;
  serverId: string;
  gameId: string;
  userId: string;
  roundNo?: number;
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
          eq(availabilities.roundNo, roundNo),
        ),
      );
    if (slotStarts.length > 0) {
      await transaction
        .insert(availabilities)
        .values(slotStarts.map((slotStart) => ({ serverId, gameId, userId, roundNo, slotStart })));
    }
  });
}
