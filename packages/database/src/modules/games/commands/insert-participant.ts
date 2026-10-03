import type { ParticipantStatus } from "#/modules/games/model/participant-status";
import type { Transaction } from "#/modules/transaction/transaction";
import { participants } from "#/schema";

// 이미 행이 있으면 넣지 않고 false를 돌려준다.
export async function insertParticipant({
  transaction,
  serverId,
  gameId,
  userId,
  status,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  userId: string;
  status: ParticipantStatus;
}) {
  const inserted = await transaction
    .insert(participants)
    .values({ serverId, gameId, userId, status })
    .onConflictDoNothing()
    .returning({ userId: participants.userId });
  return inserted.length > 0;
}
