"use server";

import { removeLateParticipant } from "@roll-and-call/database/games";
import { withdrawDelayedNotifications } from "@roll-and-call/database/notifications";
import { z } from "zod";

import { idSchema, parseActionInput, type ActionResult } from "@/shared/api";

import { adjustRoster } from "./adjust-roster";
import { RosterError } from "./roster-error";

const inputSchema = z.object({
  gameId: idSchema,
  userId: idSchema,
  notificationIds: z.array(idSchema).max(5),
});

// 참여자 추가 토스트의 [되돌리기]. 아직 보이지 않은 「구인에 참여되었습니다」 알림도 지운다.
export async function undoLateParticipant(
  input: z.input<typeof inputSchema>,
): Promise<ActionResult> {
  const parsed = parseActionInput(inputSchema, input);
  if (!parsed.ok) return parsed.result;
  const { gameId, userId, notificationIds } = parsed.data;
  return adjustRoster({
    gameId,
    userIds: [userId],
    work: async (transaction, game) => {
      const serverId = game.serverId;
      const removed = await removeLateParticipant({ transaction, serverId, gameId, userId });
      if (!removed) throw new RosterError("이미 바뀐 명단이라 되돌릴 수 없습니다.");
      await withdrawDelayedNotifications({ transaction, serverId, ids: notificationIds });
    },
  });
}
