import { and, eq } from "drizzle-orm";

import type { Transaction } from "#db/modules/transaction";
import { participants } from "#db/schema";

export async function findParticipantStatus({
  transaction,
  serverId,
  gameId,
  userId,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  userId: string;
}) {
  const [row] = await transaction
    .select({ status: participants.status })
    .from(participants)
    .where(
      and(
        eq(participants.serverId, serverId),
        eq(participants.gameId, gameId),
        eq(participants.userId, userId),
      ),
    );
  return row?.status ?? null;
}
