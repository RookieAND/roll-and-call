"use server";

import { and, eq } from "drizzle-orm";
import { uniq } from "es-toolkit";

import { PARTICIPANT_STATUS } from "@/entities/game";
import type { ActionResult } from "@/shared/api";
import { announceRecruitmentComplete, notifyDirectConfirmed, participants } from "@/shared/server";

import { adjustRoster } from "./adjust-roster";
import { findParticipantStatus } from "./find-participant-status";
import { RosterError } from "./roster-error";
import { setParticipantStatus } from "./set-participant-status";

const { confirmed } = PARTICIPANT_STATUS;

// 신청하지 않은 사람도 GM이 바로 확정으로 넣는다. 대기 중이던 사람은 확정으로 올린다.
export async function addParticipants(gameId: string, userIds: string[]): Promise<ActionResult> {
  if (userIds.length === 0) return { error: "넣을 사람을 골라 주세요." };
  const invitedIds = uniq(userIds);
  let becameFull = false;

  return adjustRoster(
    gameId,
    async (transaction, game) => {
      if (userIds.includes(game.gmId)) throw new RosterError("GM은 참여자로 넣을 수 없습니다.");

      const confirmedCount = await transaction.$count(
        participants,
        and(eq(participants.gameId, gameId), eq(participants.status, confirmed)),
      );
      if (confirmedCount + invitedIds.length > game.maxPlayers) {
        throw new RosterError(`남은 자리가 ${game.maxPlayers - confirmedCount}자리뿐입니다.`);
      }

      for (const userId of invitedIds) {
        const status = await findParticipantStatus(transaction, gameId, userId);
        if (status === confirmed) throw new RosterError("이미 참여 중인 사람이 있습니다.");
        if (status) {
          await setParticipantStatus(transaction, gameId, userId, confirmed);
        } else {
          await transaction.insert(participants).values({ gameId, userId, status: confirmed });
        }
      }
      becameFull = confirmedCount + invitedIds.length === game.maxPlayers;
    },
    async () => {
      await notifyDirectConfirmed(gameId, invitedIds);
      if (becameFull) await announceRecruitmentComplete(gameId);
    },
  );
}
