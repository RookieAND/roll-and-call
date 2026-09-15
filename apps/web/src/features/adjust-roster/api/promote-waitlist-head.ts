import "server-only";
import { and, asc, eq } from "drizzle-orm";

import { PARTICIPANT_STATUS } from "@/entities/game";
import { participants } from "@/shared/server";

import { setParticipantStatus } from "./set-participant-status";
import type { Transaction } from "./transaction";

export async function promoteWaitlistHead(
  transaction: Transaction,
  gameId: string,
  excludeUserId: string,
) {
  const waitlist = await transaction
    .select({ userId: participants.userId })
    .from(participants)
    .where(
      and(eq(participants.gameId, gameId), eq(participants.status, PARTICIPANT_STATUS.waiting)),
    )
    .orderBy(asc(participants.joinedAt));
  const head = waitlist.find((entry) => entry.userId !== excludeUserId);
  if (head)
    await setParticipantStatus(transaction, gameId, head.userId, PARTICIPANT_STATUS.confirmed);
}
