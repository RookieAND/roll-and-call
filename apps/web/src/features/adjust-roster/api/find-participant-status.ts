import "server-only";
import { and, eq } from "drizzle-orm";

import { participants } from "@/shared/server";

import type { Transaction } from "./transaction";

export async function findParticipantStatus(
  transaction: Transaction,
  gameId: string,
  userId: string,
) {
  const [row] = await transaction
    .select({ status: participants.status })
    .from(participants)
    .where(and(eq(participants.gameId, gameId), eq(participants.userId, userId)));
  return row?.status ?? null;
}
