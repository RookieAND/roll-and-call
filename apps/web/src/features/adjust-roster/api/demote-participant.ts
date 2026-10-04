"use server";

import { findParticipantStatus, setParticipantStatus } from "@roll-and-call/database/games";
import { isNull } from "es-toolkit";

import { PARTICIPANT_STATUS, RECRUIT_METHOD } from "@/entities/game";
import type { ActionResult } from "@/shared/api";
import { notifyMovedToWaitlist } from "@/shared/server";

import { adjustRoster } from "./adjust-roster";
import { PARTICIPANT_NOT_FOUND_MESSAGE, RosterError } from "./roster-error";
import { WAITLIST_AFTER_START_MESSAGE } from "./waitlist-after-start-message";

// 내려온 자리는 저절로 차지 않는다. 대기 맨 앞을 자동으로 올리면 GM이 짜 둔 명단이 뒤집힌다.
// 내린 사람은 내린 시각으로 대기 맨 뒤에 선다. 추첨 전이면 다시 추첨 신청자가 된다.
export async function demoteParticipant({
  gameId,
  userId,
}: {
  gameId: string;
  userId: string;
}): Promise<ActionResult> {
  let movedToWaitlist = false;

  return adjustRoster({
    gameId,
    work: async (transaction, game, { started, now }) => {
      const serverId = game.serverId;
      const status = await findParticipantStatus({ transaction, serverId, gameId, userId });
      if (status !== PARTICIPANT_STATUS.confirmed && status !== PARTICIPANT_STATUS.waiting) {
        throw new RosterError(PARTICIPANT_NOT_FOUND_MESSAGE);
      }
      if (status === PARTICIPANT_STATUS.waiting) return;
      if (started) throw new RosterError(WAITLIST_AFTER_START_MESSAGE);

      await setParticipantStatus({
        transaction,
        serverId,
        gameId,
        userId,
        status: PARTICIPANT_STATUS.waiting,
        waitlistedAt: now,
      });
      // 추첨 전 신청자 명단은 스레드에 없어 안내하지 않는다.
      movedToWaitlist = !(game.recruitMethod === RECRUIT_METHOD.lottery && isNull(game.drawnAt));
    },
    notify: async (server) => {
      if (movedToWaitlist) await notifyMovedToWaitlist({ server, gameId, userId });
    },
  });
}
