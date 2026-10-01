import { and, eq } from "drizzle-orm";

import { participants } from "../../../schema";
import type { Transaction } from "../../transaction/transaction";
import type { ParticipantStatus } from "../model/participant-status";

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
