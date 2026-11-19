"use server";

import { removeLastRound } from "@roll-and-call/database/games";
import { withdrawDelayedNotifications } from "@roll-and-call/database/notifications";
import { z } from "zod";

import { idSchema, parseActionInput, type ActionResult } from "@/shared/api";

import { guardRoundPlan } from "./guard-round-plan";
import { RoundPlanError } from "./round-plan-error";

const inputSchema = z.object({
  gameId: idSchema,
  roundNo: z.number().int().min(3).max(52),
  notificationIds: z.array(idSchema).max(40),
});

// 회차 추가 토스트의 [되돌리기]. 아직 보이지 않은 참여자 알림도 함께 지운다.
export async function undoAddRound(input: z.input<typeof inputSchema>): Promise<ActionResult> {
  const parsed = parseActionInput(inputSchema, input);
  if (!parsed.ok) return parsed.result;
  const { gameId, roundNo, notificationIds } = parsed.data;
  return guardRoundPlan({
    gameId,
    work: async ({ transaction, serverId }) => {
      const removed = await removeLastRound({ transaction, serverId, gameId, roundNo });
      if (!removed) throw new RoundPlanError("이미 바뀐 회차라 되돌릴 수 없습니다.");
      await withdrawDelayedNotifications({ transaction, serverId, ids: notificationIds });
      return {};
    },
  });
}
