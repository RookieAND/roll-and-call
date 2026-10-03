import { and, eq } from "drizzle-orm";

import type { ParticipantStatus } from "#/modules/games/model/participant-status";
import type { Transaction } from "#/modules/transaction/transaction";
import { participants } from "#/schema";

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
