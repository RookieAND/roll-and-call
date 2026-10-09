"use server";

import { findParticipantStatus, setParticipantStatus } from "@roll-and-call/database/games";
import { isAwaitingResult } from "@roll-and-call/database/games/model";
import { NOTIFICATION_KIND } from "@roll-and-call/database/notifications/model";

import { PARTICIPANT_STATUS } from "@/entities/game";
import type { ActionResult } from "@/shared/api";
import { notifyMovedToWaitlist } from "@/shared/server";

import { adjustRoster } from "./adjust-roster";
import { notifyRosterChange } from "./notify-roster-change";
import { PARTICIPANT_NOT_FOUND_MESSAGE, RosterError } from "./roster-error";
import { WAITLIST_AFTER_START_MESSAGE } from "./waitlist-after-start-message";
import { waitlistRankOf } from "./waitlist-rank-of";

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
    userIds: [userId],
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
      // 결과 전이면 대기가 아니라 다시 신청자가 된다. 스레드 안내도, 알림도 만들지 않는다.
      movedToWaitlist = !isAwaitingResult(game);
      if (!movedToWaitlist) return;
      const waitlistRank = await waitlistRankOf({ transaction, serverId, gameId, userId });
      await notifyRosterChange({
        transaction,
        game,
        notifications: [
          {
            userId,
            kind: NOTIFICATION_KIND.movedToWaitlist,
            params: { gameId, gameTitle: game.title, waitlistRank },
          },
        ],
      });
    },
    notify: async (server) => {
      if (movedToWaitlist) await notifyMovedToWaitlist({ server, gameId, userId });
    },
  });
}
