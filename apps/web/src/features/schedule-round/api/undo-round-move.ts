"use server";

import {
  listGameRoundsInTransaction,
  moveRounds,
  setRepeatRule,
} from "@roll-and-call/database/games";
import { withdrawDelayedNotifications } from "@roll-and-call/database/notifications";
import { z } from "zod";

import { idSchema, parseActionInput, type ActionResult } from "@/shared/api";

import { guardRoundSchedule } from "./guard-round-schedule";
import { RoundScheduleError } from "./round-schedule-error";

const inputSchema = z.object({
  gameId: idSchema,
  previous: z
    .array(
      z.object({
        roundNo: z.number().int().min(1).max(52),
        startsAt: z.iso.datetime(),
        endsAt: z.iso.datetime(),
      }),
    )
    .min(1)
    .max(52),
  notificationIds: z.array(idSchema).max(400),
  repeatRule: z
    .object({
      weekday: z.number().int().min(0).max(6),
      startTime: z.string(),
      endTime: z.string(),
      intervalWeeks: z.number().int().min(1).max(52),
    })
    .nullable(),
});

// 일정 옮기기 토스트의 [되돌리기]. 옮긴 회차가 하나라도 시작했으면 되돌리지 않는다.
export async function undoRoundMove(input: z.input<typeof inputSchema>): Promise<ActionResult> {
  const parsed = parseActionInput(inputSchema, input);
  if (!parsed.ok) return parsed.result;
  const { gameId, previous, notificationIds, repeatRule } = parsed.data;
  return guardRoundSchedule({
    gameId,
    work: async ({ transaction, serverId }) => {
      const now = Date.now();
      const rounds = await listGameRoundsInTransaction({ transaction, serverId, gameId });
      const started = previous.some((entry) => {
        const round = rounds.find((candidate) => candidate.roundNo === entry.roundNo);
        return !round?.startAt || round.startAt.getTime() <= now;
      });
      if (started) throw new RoundScheduleError("이미 시작한 회차가 있어 되돌릴 수 없습니다.");
      await moveRounds({
        transaction,
        serverId,
        gameId,
        moves: previous.map((entry) => ({
          roundNo: entry.roundNo,
          startAt: new Date(entry.startsAt),
          plannedEndAt: new Date(entry.endsAt),
        })),
      });
      await setRepeatRule({ transaction, serverId, gameId, repeatRule });
      await withdrawDelayedNotifications({ transaction, serverId, ids: notificationIds });
      return {};
    },
  });
}
