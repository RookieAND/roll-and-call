"use server";

import {
  addLateParticipant as insertLateParticipant,
  findParticipantStatus,
  findScheduleConflicts,
  listDatedRounds,
} from "@roll-and-call/database/games";
import {
  createDelayedNotifications,
  NOTIFICATION_KIND,
  UNDO_WINDOW_MS,
} from "@roll-and-call/database/notifications";
import { z } from "zod";

import { PARTICIPANT_STATUS } from "@/entities/game";
import { idSchema, parseActionInput, type ActionResult } from "@/shared/api";

import { adjustRoster } from "./adjust-roster";
import { rejectSanctioned } from "./reject-sanctioned";
import { RosterError } from "./roster-error";

const inputSchema = z.object({ gameId: idSchema, userId: idSchema });

export type AddLateParticipantResult = ActionResult & { notificationIds?: string[] };

// 다회차 1회차 시작 뒤 GM이 한 명을 참여자로 더한다. 정원을 같이 늘리고 중도 합류로 기록한다.
// 「구인에 참여되었습니다」 알림은 되돌리기 토스트가 사라진 뒤에 보인다.
export async function addLateParticipant(
  input: z.input<typeof inputSchema>,
): Promise<AddLateParticipantResult> {
  const parsed = parseActionInput(inputSchema, input);
  if (!parsed.ok) return parsed.result;
  const { gameId, userId } = parsed.data;
  let notificationIds: string[] = [];

  const result = await adjustRoster({
    gameId,
    userIds: [userId],
    work: async (transaction, game, timing) => {
      if (game.roundCount < 2 || !timing.started) {
        throw new RosterError("1회차가 시작된 여러 번 진행하는 구인에서만 쓸 수 있습니다.");
      }
      if (userId === game.gmId) throw new RosterError("GM은 참여자로 넣을 수 없습니다.");
      const serverId = game.serverId;
      const status = await findParticipantStatus({ transaction, serverId, gameId, userId });
      if (status === PARTICIPANT_STATUS.confirmed)
        throw new RosterError("이미 참여 중인 사람입니다.");
      const conflicts = await findScheduleConflicts({
        transaction,
        serverId,
        gameId,
        people: [{ userId, role: "confirmed" }],
        target: await listDatedRounds({ transaction, gameId }),
      });
      if (conflicts.length > 0) {
        const roundNo = conflicts[0]!.roundNos[0];
        throw new RosterError(`${roundNo}회차와 겹치는 세션이 있습니다.`);
      }
      await rejectSanctioned({ transaction, serverId, userIds: [userId], timing });
      await insertLateParticipant({ transaction, serverId, gameId, userId });
      notificationIds = await createDelayedNotifications({
        transaction,
        serverId,
        actorId: game.gmId,
        visibleAt: new Date(timing.now.getTime() + UNDO_WINDOW_MS),
        notifications: [
          {
            userId,
            kind: NOTIFICATION_KIND.newGameJoined,
            params: { gameId, gameTitle: game.title },
          },
        ],
      });
    },
  });
  return result.error ? result : { ...result, notificationIds };
}
