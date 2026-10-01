"use server";

import { and, eq } from "drizzle-orm";

import type { ActionResult } from "@/shared/api";
import { notifyGameLeft, participants } from "@/shared/server";

import { adjustRoster } from "./adjust-roster";
import { PARTICIPANT_NOT_FOUND_MESSAGE, RosterError } from "./roster-error";

export async function removeParticipant({
  gameId,
  userId,
}: {
  gameId: string;
  userId: string;
}): Promise<ActionResult> {
  return adjustRoster({
    gameId,
    work: async (transaction) => {
      const [removed] = await transaction
        .delete(participants)
        .where(and(eq(participants.gameId, gameId), eq(participants.userId, userId)))
        .returning({ status: participants.status });
      if (!removed) throw new RosterError(PARTICIPANT_NOT_FOUND_MESSAGE);
    },
    notify: () => notifyGameLeft({ gameId, userId, removedByGm: true }),
  });
}
