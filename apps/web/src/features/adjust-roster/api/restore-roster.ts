"use server";

import { PARTICIPANT_STATUS } from "@/entities/game";
import type { ActionResult } from "@/shared/api";

import type { RosterEntry } from "../model/roster-entry";
import { adjustRoster } from "./adjust-roster";
import { findParticipantStatus } from "./find-participant-status";
import { RosterError } from "./roster-error";
import { setParticipantStatus } from "./set-participant-status";

export async function restoreRoster({
  gameId,
  entries,
}: {
  gameId: string;
  entries: RosterEntry[];
}): Promise<ActionResult> {
  const valid = entries.every(
    (entry) =>
      entry.status === PARTICIPANT_STATUS.confirmed || entry.status === PARTICIPANT_STATUS.waiting,
  );
  if (!valid || entries.length === 0) return { error: "되돌릴 수 없는 요청입니다." };

  return adjustRoster({
    gameId,
    work: async (transaction) => {
      for (const entry of entries) {
        if (!(await findParticipantStatus({ transaction, gameId, userId: entry.userId }))) {
          throw new RosterError("명단이 바뀌어 되돌릴 수 없습니다.");
        }
      }
      for (const entry of entries) {
        await setParticipantStatus({
          transaction,
          gameId,
          userId: entry.userId,
          status: entry.status,
        });
      }
    },
  });
}
