import { and, eq } from "drizzle-orm";

import type { ParticipantStatus } from "#db/modules/games/model/participant-status";
import type { Transaction } from "#db/modules/transaction";
import { participants } from "#db/schema";

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
