import "server-only";
import { and, eq } from "drizzle-orm";

import type { ParticipantStatus } from "@/entities/game";
import { participants } from "@/shared/server";

import type { Transaction } from "./transaction";

export async function setParticipantStatus(
  transaction: Transaction,
  gameId: string,
  userId: string,
  status: ParticipantStatus,
) {
  await transaction
    .update(participants)
    .set({ status })
    .where(and(eq(participants.gameId, gameId), eq(participants.userId, userId)));
}
