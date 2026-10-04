import { and, eq, inArray } from "drizzle-orm";

import type { Transaction } from "#/modules/transaction/transaction";
import { participants } from "#/schema";

export async function listAttendanceRows({
  transaction,
  serverId,
  gameId,
  userIds,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  userIds: string[];
}) {
  if (userIds.length === 0) return [];
  return transaction
    .select({
      userId: participants.userId,
      status: participants.status,
      absent: participants.absent,
      absenceCancelledAt: participants.absenceCancelledAt,
      absenceAddedAt: participants.absenceAddedAt,
    })
    .from(participants)
    .where(
      and(
        eq(participants.serverId, serverId),
        eq(participants.gameId, gameId),
        inArray(participants.userId, userIds),
      ),
    );
}
