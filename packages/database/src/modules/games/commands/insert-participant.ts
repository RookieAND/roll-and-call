import { participants } from "../../../schema";
import type { Transaction } from "../../transaction/transaction";
import type { ParticipantStatus } from "../model/participant-status";

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
