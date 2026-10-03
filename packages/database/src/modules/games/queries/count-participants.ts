import { and, eq } from "drizzle-orm";

import { db } from "#/client";
import type { ParticipantStatus } from "#/modules/games/model/participant-status";
import type { Transaction } from "#/modules/transaction/transaction";
import { participants } from "#/schema";

export async function countParticipants({
  transaction,
  serverId,
  gameId,
  status,
}: {
  transaction?: Transaction;
  serverId: string;
  gameId: string;
  status: ParticipantStatus;
}) {
  return (transaction ?? db).$count(
    participants,
    and(
      eq(participants.serverId, serverId),
      eq(participants.gameId, gameId),
      eq(participants.status, status),
    ),
  );
}
