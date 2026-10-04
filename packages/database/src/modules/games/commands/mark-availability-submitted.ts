import { and, eq, sql } from "drizzle-orm";

import type { Transaction } from "#/modules/transaction/transaction";
import { participants } from "#/schema";

// 본인이 조율표를 저장했다(0칸 저장 포함). participants 행이 없는 GM은 바뀌는 행이 없다.
export async function markAvailabilitySubmitted({
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
  await transaction
    .update(participants)
    .set({ availabilitySubmittedAt: sql`now()` })
    .where(
      and(
        eq(participants.serverId, serverId),
        eq(participants.gameId, gameId),
        eq(participants.userId, userId),
      ),
    );
}
