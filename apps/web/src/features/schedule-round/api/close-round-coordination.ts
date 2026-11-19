"use server";

import { closeRoundCoordination as closeRoundCoordinationCommand } from "@roll-and-call/database/games";
import { z } from "zod";

import { idSchema, parseActionInput, type ActionResult } from "@/shared/api";

import { guardRoundSchedule } from "./guard-round-schedule";

const inputSchema = z.object({ gameId: idSchema, roundNo: z.number().int().min(1).max(52) });

// 가능 시간 모으기를 닫는다. 일정이 있으면 그 일정으로, 없으면 일정 없음으로 돌아가고 응답은 남는다.
export async function closeRoundCoordination(
  input: z.input<typeof inputSchema>,
): Promise<ActionResult> {
  const parsed = parseActionInput(inputSchema, input);
  if (!parsed.ok) return parsed.result;
  const { gameId, roundNo } = parsed.data;
  return guardRoundSchedule<ActionResult>({
    gameId,
    work: async ({ transaction, serverId }) => {
      await closeRoundCoordinationCommand({ transaction, serverId, gameId, roundNo });
      return {};
    },
  });
}
