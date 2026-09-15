"use server";

import { and, desc, eq } from "drizzle-orm";

import { PARTICIPANT_STATUS } from "@/entities/game";
import type { ActionResult } from "@/shared/api";
import { participants } from "@/shared/server";

import { adjustRoster } from "./adjust-roster";
import { findParticipantStatus } from "./find-participant-status";
import { PARTICIPANT_NOT_FOUND_MESSAGE, RosterError } from "./roster-error";
import { setParticipantStatus } from "./set-participant-status";

const { confirmed, waiting } = PARTICIPANT_STATUS;

// 정원이 찼으면 가장 늦게 신청한 확정자를 대기로 민다. 화면은 정원이 차면 "교체"를 쓰므로 경합 때만 일어난다.
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
      const [latest] = await transaction
        .select({ userId: participants.userId })
        .from(participants)
        .where(and(eq(participants.gameId, gameId), eq(participants.status, confirmed)))
        .orderBy(desc(participants.joinedAt))
        .limit(1);
      if (latest) await setParticipantStatus(transaction, gameId, latest.userId, waiting);
    }
    await setParticipantStatus(transaction, gameId, userId, confirmed);
  });
}
