import { and, eq } from "drizzle-orm";

import type { ParticipantStatus } from "../../rules";
import { participants } from "../../schema";
import type { Transaction } from "../transaction/transaction";

export async function setParticipantStatus({
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
  await transaction
    .update(participants)
    .set({ status })
    .where(
      and(
        eq(participants.serverId, serverId),
        eq(participants.gameId, gameId),
        eq(participants.userId, userId),
      ),
    );
}
