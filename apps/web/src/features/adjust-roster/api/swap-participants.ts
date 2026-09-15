"use server";

import { PARTICIPANT_STATUS } from "@/entities/game";
import type { ActionResult } from "@/shared/api";

import { adjustRoster } from "./adjust-roster";
import { findParticipantStatus } from "./find-participant-status";
import { RosterError } from "./roster-error";
import { setParticipantStatus } from "./set-participant-status";

export async function swapParticipants(
  gameId: string,
  promoteUserId: string,
  demoteUserId: string,
): Promise<ActionResult> {
  return adjustRoster(gameId, async (transaction) => {
    const incoming = await findParticipantStatus(transaction, gameId, promoteUserId);
    const outgoing = await findParticipantStatus(transaction, gameId, demoteUserId);
    if (incoming !== PARTICIPANT_STATUS.waiting || outgoing !== PARTICIPANT_STATUS.confirmed) {
      throw new RosterError("명단이 바뀌었습니다. 새로고침 후 다시 시도하세요.");
    }
    await setParticipantStatus(transaction, gameId, demoteUserId, PARTICIPANT_STATUS.waiting);
    await setParticipantStatus(transaction, gameId, promoteUserId, PARTICIPANT_STATUS.confirmed);
  });
}
