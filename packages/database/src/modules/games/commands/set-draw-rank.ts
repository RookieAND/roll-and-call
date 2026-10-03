import { and, eq } from "drizzle-orm";

import type { ParticipantStatus } from "#/modules/games/model/participant-status";
import type { Transaction } from "#/modules/transaction/transaction";
import { participants } from "#/schema";

export async function setDrawRank({
  transaction,
  serverId,
  gameId,
  userId,
  drawRank,
  status,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  userId: string;
  drawRank: number;
  status: ParticipantStatus;
}) {
  await transaction
    .update(participants)
    .set({ drawRank, status })
    .where(
      and(
        eq(participants.serverId, serverId),
        eq(participants.gameId, gameId),
        eq(participants.userId, userId),
      ),
    );
}
