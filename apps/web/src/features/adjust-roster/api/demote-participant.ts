"use server";

import { findParticipantStatus, setParticipantStatus } from "@roll-and-call/database/games";

import { PARTICIPANT_STATUS } from "@/entities/game";
import type { ActionResult } from "@/shared/api";

import { adjustRoster } from "./adjust-roster";
import { PARTICIPANT_NOT_FOUND_MESSAGE, RosterError } from "./roster-error";

// 내려온 자리는 저절로 차지 않는다. 대기 맨 앞을 자동으로 올리면 GM이 짜 둔 명단이 뒤집힌다.
export async function demoteParticipant({
  gameId,
  userId,
}: {
  gameId: string;
  userId: string;
}): Promise<ActionResult> {
  return adjustRoster({
    gameId,
    work: async (transaction, { serverId }) => {
      const status = await findParticipantStatus({ transaction, serverId, gameId, userId });
      if (!status) throw new RosterError(PARTICIPANT_NOT_FOUND_MESSAGE);
      if (status === PARTICIPANT_STATUS.waiting) return;
      await setParticipantStatus({
        transaction,
        serverId,
        gameId,
        userId,
        status: PARTICIPANT_STATUS.waiting,
      });
    },
  });
}
