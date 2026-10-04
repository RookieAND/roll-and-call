"use server";

import {
  deleteParticipant,
  findParticipantStatus,
  listSeatOpenedRecipients,
  markParticipantRemoved,
} from "@roll-and-call/database/games";
import {
  NOTIFICATION_KIND,
  type NotificationInput,
} from "@roll-and-call/database/notifications/model";

import { PARTICIPANT_STATUS } from "@/entities/game";
import type { ActionResult } from "@/shared/api";
import { notifyGameLeft } from "@/shared/server";

import { absenceReasonOf } from "../model/absence-reason-of";
import { adjustRoster } from "./adjust-roster";
import { notifyRosterChange } from "./notify-roster-change";
import { PARTICIPANT_NOT_FOUND_MESSAGE, RosterError } from "./roster-error";

// 세션 시작 뒤 확정자는 행을 남겨 불참으로 기록한다. 그 밖(시작 전, 시작 뒤 대기자)은 행을 지운다.
// 불참 사실과 사유는 스레드에도 알림에도 쓰지 않는다(사유는 운영진만 본다).
export async function removeParticipant({
  gameId,
  userId,
  absenceReason,
}: {
  gameId: string;
  userId: string;
  absenceReason?: string;
}): Promise<ActionResult> {
  const reason = absenceReasonOf(absenceReason);
  if ("error" in reason) return { error: reason.error };

  return adjustRoster({
    gameId,
    userIds: [userId],
    work: async (transaction, game, { started, now }) => {
      const serverId = game.serverId;
      const params = { gameId, gameTitle: game.title };
      const status = await findParticipantStatus({ transaction, serverId, gameId, userId });
      if (!status) throw new RosterError(PARTICIPANT_NOT_FOUND_MESSAGE);
      if (status === PARTICIPANT_STATUS.removed) {
        throw new RosterError("이미 불참으로 내보낸 사람입니다.");
      }

      if (started && status === PARTICIPANT_STATUS.confirmed) {
        const marked = await markParticipantRemoved({
          transaction,
          serverId,
          gameId,
          userId,
          absenceReason: reason.value,
        });
        if (!marked) throw new RosterError(PARTICIPANT_NOT_FOUND_MESSAGE);
        await notifyRosterChange({
          transaction,
          game,
          notifications: [{ userId, kind: NOTIFICATION_KIND.absenceRecorded, params }],
        });
        return;
      }
      const removed = await deleteParticipant({ transaction, serverId, gameId, userId });
      if (!removed) throw new RosterError(PARTICIPANT_NOT_FOUND_MESSAGE);
      // 세션 시작 뒤 대기자를 내보낸 경우는 알림이 없다.
      if (started) return;

      const notifications: NotificationInput[] = [
        { userId, kind: NOTIFICATION_KIND.removedFromRoster, params },
      ];
      if (status === PARTICIPANT_STATUS.confirmed) {
        const recipients = await listSeatOpenedRecipients({
          transaction,
          serverId,
          gameId,
          game,
          now,
        });
        notifications.push(
          ...recipients.map((recipientId) => ({
            userId: recipientId,
            kind: NOTIFICATION_KIND.seatOpened,
            params,
          })),
        );
      }
      await notifyRosterChange({ transaction, game, notifications });
    },
    notify: (server) => notifyGameLeft({ server, gameId, userId, removedByGm: true }),
  });
}
