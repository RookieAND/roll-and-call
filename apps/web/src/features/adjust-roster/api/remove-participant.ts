"use server";

import {
  deleteParticipant,
  findParticipantStatus,
  listGameRoundsInTransaction,
  listSeatOpenedRecipients,
  markParticipantRemoved,
} from "@roll-and-call/database/games";
import {
  NOTIFICATION_KIND,
  type NotificationInput,
} from "@roll-and-call/database/notifications/model";
import { z } from "zod";

import { PARTICIPANT_STATUS } from "@/entities/game";
import { parseActionInput, type ActionResult } from "@/shared/api";
import { notifyGameLeft } from "@/shared/server";

import { absenceReasonOf } from "../model/absence-reason-of";
import { rosterMemberInputSchema } from "../model/roster-member-input";
import { adjustRoster } from "./adjust-roster";
import { notifyRosterChange } from "./notify-roster-change";
import { PARTICIPANT_NOT_FOUND_MESSAGE, RosterError } from "./roster-error";

// 사유의 길이 안내는 absenceReasonOf가 한다. 여기서는 터무니없이 긴 입력만 막는다.
const ABSENCE_REASON_INPUT_MAX = 1000;

const inputSchema = rosterMemberInputSchema.extend({
  absenceReason: z.string().max(ABSENCE_REASON_INPUT_MAX).optional(),
  // 다회차 1회차 시작 뒤 확정자를 내보낼 때만 받는다. removed는 불참 기록 1건, mutual은 기록 없음.
  leftReason: z.enum(["removed", "mutual"]).optional(),
});

// 세션 시작 뒤 확정자는 행을 남겨 불참으로 기록한다. 그 밖(시작 전, 시작 뒤 대기자)은 행을 지운다.
// 불참 사실과 사유는 스레드에도 알림에도 쓰지 않는다(사유는 운영진만 본다).
export async function removeParticipant(input: z.input<typeof inputSchema>): Promise<ActionResult> {
  const parsed = parseActionInput(inputSchema, input);
  if (!parsed.ok) return parsed.result;
  const { gameId, userId, absenceReason, leftReason } = parsed.data;
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
        const multiRound = game.roundCount > 1;
        if (multiRound && !leftReason) throw new RosterError("내보내는 방식을 골라 주세요.");
        const rounds = multiRound
          ? await listGameRoundsInTransaction({ transaction, serverId, gameId })
          : [];
        const kickedRound = rounds.filter((round) => round.startAt && round.startAt <= now).at(-1);
        const marked = await markParticipantRemoved({
          transaction,
          serverId,
          gameId,
          userId,
          absenceReason: reason.value,
          leftReason: multiRound ? leftReason : undefined,
          absenceAt: kickedRound?.startAt ?? null,
        });
        if (!marked) throw new RosterError(PARTICIPANT_NOT_FOUND_MESSAGE);
        const kind =
          leftReason === "mutual"
            ? NOTIFICATION_KIND.removedFromRoster
            : NOTIFICATION_KIND.absenceRecorded;
        await notifyRosterChange({ transaction, game, notifications: [{ userId, kind, params }] });
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
