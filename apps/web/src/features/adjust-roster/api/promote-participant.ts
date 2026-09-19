"use server";

import { and, eq } from "drizzle-orm";

import { PARTICIPANT_STATUS } from "@/entities/game";
import type { ActionResult } from "@/shared/api";
import { participants } from "@/shared/server";

import { adjustRoster } from "./adjust-roster";
import { findParticipantStatus } from "./find-participant-status";
import { PARTICIPANT_NOT_FOUND_MESSAGE, RosterError } from "./roster-error";
import { setParticipantStatus } from "./set-participant-status";

const { confirmed } = PARTICIPANT_STATUS;

// 정원을 넘겨 확정하지 않는다. 자리를 비우는 일은 GM이 대기로 이동으로 직접 한다.
export async function promoteParticipant(gameId: string, userId: string): Promise<ActionResult> {
  return adjustRoster(gameId, async (transaction, game) => {
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
  });
}
