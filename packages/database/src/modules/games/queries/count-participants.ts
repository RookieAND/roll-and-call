import { and, eq } from "drizzle-orm";

import { db } from "../../../client";
import { participants } from "../../../schema";
import type { Transaction } from "../../transaction/transaction";
import type { ParticipantStatus } from "../model/participant-status";

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
