"use server";

import { findParticipantStatus, setParticipantStatus } from "@roll-and-call/database/games";

import { PARTICIPANT_STATUS } from "@/entities/game";
import type { ActionResult } from "@/shared/api";

import type { RosterEntry } from "../model/roster-entry";
import { adjustRoster } from "./adjust-roster";
import { RosterError } from "./roster-error";

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
    work: async (transaction, { serverId }) => {
      for (const entry of entries) {
        if (
          !(await findParticipantStatus({ transaction, serverId, gameId, userId: entry.userId }))
        ) {
          throw new RosterError("명단이 바뀌어 되돌릴 수 없습니다.");
        }
      }
      for (const entry of entries) {
        await setParticipantStatus({
          transaction,
          serverId,
          gameId,
          userId: entry.userId,
          status: entry.status,
        });
      }
    },
  });
}
