import { and, eq } from "drizzle-orm";

import { participants } from "../../../schema";
import type { Transaction } from "../../transaction/transaction";
import type { ParticipantStatus } from "../model/participant-status";

export async function listParticipantUserIds({
  transaction,
  serverId,
  gameId,
  status,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  status: ParticipantStatus;
}) {
  const rows = await transaction
    .select({ userId: participants.userId })
    .from(participants)
    .where(
      and(
        eq(participants.serverId, serverId),
        eq(participants.gameId, gameId),
        eq(participants.status, status),
      ),
    );
  return rows.map((row) => row.userId);
}
