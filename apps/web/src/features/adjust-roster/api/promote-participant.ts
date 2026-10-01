"use server";

import { and, eq } from "drizzle-orm";

import { PARTICIPANT_STATUS } from "@/entities/game";
import type { ActionResult } from "@/shared/api";
import { announceRecruitmentComplete, notifyDirectConfirmed, participants } from "@/shared/server";

import { adjustRoster } from "./adjust-roster";
import { findParticipantStatus } from "./find-participant-status";
import { PARTICIPANT_NOT_FOUND_MESSAGE, RosterError } from "./roster-error";
import { setParticipantStatus } from "./set-participant-status";

const { confirmed } = PARTICIPANT_STATUS;

export async function promoteParticipant(gameId: string, userId: string): Promise<ActionResult> {
  let promoted = false;
  let becameFull = false;

  return adjustRoster(
    gameId,
    async (transaction, game) => {
      const status = await findParticipantStatus(transaction, gameId, userId);
      if (!status) throw new RosterError(PARTICIPANT_NOT_FOUND_MESSAGE);
      if (status === confirmed) return;

      const confirmedCount = await transaction.$count(
        participants,
        and(eq(participants.gameId, gameId), eq(participants.status, confirmed)),
      );
      if (confirmedCount >= game.maxPlayers) {
        throw new RosterError(
          `정원 ${game.maxPlayers}명이 차 있습니다. 확정에서 한 명을 대기로 옮기세요.`,
        );
      }
      await setParticipantStatus(transaction, gameId, userId, confirmed);
      promoted = true;
      becameFull = confirmedCount + 1 === game.maxPlayers;
    },
    async () => {
      if (!promoted) return;
      await notifyDirectConfirmed(gameId, [userId]);
      if (becameFull) await announceRecruitmentComplete(gameId);
    },
  );
}
