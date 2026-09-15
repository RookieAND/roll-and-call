"use server";

import { PARTICIPANT_STATUS } from "@/entities/game";
import type { ActionResult } from "@/shared/api";

import { adjustRoster } from "./adjust-roster";
import { findParticipantStatus } from "./find-participant-status";
import { promoteWaitlistHead } from "./promote-waitlist-head";
import { PARTICIPANT_NOT_FOUND_MESSAGE, RosterError } from "./roster-error";
import { setParticipantStatus } from "./set-participant-status";

export async function demoteParticipant(gameId: string, userId: string): Promise<ActionResult> {
  return adjustRoster(gameId, async (transaction) => {
    const status = await findParticipantStatus(transaction, gameId, userId);
    if (!status) throw new RosterError(PARTICIPANT_NOT_FOUND_MESSAGE);
    if (status === PARTICIPANT_STATUS.waiting) return;
    await setParticipantStatus(transaction, gameId, userId, PARTICIPANT_STATUS.waiting);
    await promoteWaitlistHead(transaction, gameId, userId);
  });
}
