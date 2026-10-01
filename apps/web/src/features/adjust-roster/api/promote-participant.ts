"use server";

import {
  countParticipants,
  findParticipantStatus,
  setParticipantStatus,
} from "@roll-and-call/database/games";

import { PARTICIPANT_STATUS } from "@/entities/game";
import type { ActionResult } from "@/shared/api";
import { announceRecruitmentComplete, notifyDirectConfirmed } from "@/shared/server";

import { adjustRoster } from "./adjust-roster";
import { PARTICIPANT_NOT_FOUND_MESSAGE, RosterError } from "./roster-error";

const { confirmed } = PARTICIPANT_STATUS;

export async function promoteParticipant({
  gameId,
  userId,
}: {
  gameId: string;
  userId: string;
}): Promise<ActionResult> {
  let promoted = false;
  let becameFull = false;

  return adjustRoster({
    gameId,
    work: async (transaction, game) => {
      const serverId = game.serverId;
      const status = await findParticipantStatus({ transaction, serverId, gameId, userId });
      if (!status) throw new RosterError(PARTICIPANT_NOT_FOUND_MESSAGE);
      if (status === confirmed) return;

      const confirmedCount = await countParticipants({
        transaction,
        serverId,
        gameId,
        status: confirmed,
      });
      if (confirmedCount >= game.maxPlayers) {
        throw new RosterError(
          `정원 ${game.maxPlayers}명이 차 있습니다. 확정에서 한 명을 대기로 옮기세요.`,
        );
      }
      await setParticipantStatus({ transaction, serverId, gameId, userId, status: confirmed });
      promoted = true;
      becameFull = confirmedCount + 1 === game.maxPlayers;
    },
    notify: async (server) => {
      if (!promoted) return;
      await notifyDirectConfirmed({ server, gameId, userIds: [userId] });
      if (becameFull) await announceRecruitmentComplete({ server, gameId });
    },
  });
}
