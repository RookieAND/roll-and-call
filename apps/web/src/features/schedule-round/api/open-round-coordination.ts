"use server";

import {
  listGameRoundsInTransaction,
  listParticipantUserIds,
  openRoundCoordination as openRoundCoordinationCommand,
} from "@roll-and-call/database/games";
import {
  awaitingResultMethod,
  AWAITING_RESULT_PHRASE,
  PARTICIPANT_STATUS,
  roundCoordinationError,
  schedulableRoundNo,
} from "@roll-and-call/database/games/model";
import { createNotifications, NOTIFICATION_KIND } from "@roll-and-call/database/notifications";
import { isNull } from "es-toolkit";
import { after } from "next/server";
import { z } from "zod";

import { idSchema, parseActionInput, type ActionResult } from "@/shared/api";
import { toKstDateInput } from "@/shared/lib";
import { getActingMember, notifyRoundAvailability } from "@/shared/server";

import { guardRoundSchedule } from "./guard-round-schedule";
import { RoundScheduleError } from "./round-schedule-error";

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const hourSchema = z.number().int().min(0).max(23);

const inputSchema = z.object({
  gameId: idSchema,
  roundNo: z.number().int().min(1).max(52),
  start: dateSchema,
  end: dateSchema,
  windowStartHour: hourSchema,
  windowEndHour: hourSchema,
});

// 회차의 가능 시간 모으기를 연다. 일정 없는 가장 앞 회차(조율형) 또는 아직 시작하지 않은 회차(다시 조율)만 열 수 있고,
// 한 번에 한 회차만 모은다. 확정 참여자에게 알리고 스레드에도 올린다.
export async function openRoundCoordination(
  input: z.input<typeof inputSchema>,
): Promise<ActionResult> {
  const parsed = parseActionInput(inputSchema, input);
  if (!parsed.ok) return parsed.result;
  const { gameId, roundNo, start, end, windowStartHour, windowEndHour } = parsed.data;
  if (windowStartHour === windowEndHour) return { error: "시간대의 시작과 끝이 같습니다." };
  const now = new Date();
  const dateError = roundCoordinationError({ start, end, today: toKstDateInput(now) });
  if (dateError) return { error: dateError };
  const member = await getActingMember();
  const result = await guardRoundSchedule<ActionResult>({
    gameId,
    work: async ({ transaction, game, serverId }) => {
      const awaiting = awaitingResultMethod(game);
      if (awaiting) {
        throw new RoundScheduleError(
          `${AWAITING_RESULT_PHRASE[awaiting]} 가능 시간을 모을 수 있습니다.`,
        );
      }
      const rounds = await listGameRoundsInTransaction({ transaction, serverId, gameId });
      const target = rounds.find((round) => round.roundNo === roundNo);
      if (!target) throw new RoundScheduleError("회차를 찾을 수 없습니다.");
      if (rounds.some((round) => round.roundNo !== roundNo && round.status === "coordinating")) {
        throw new RoundScheduleError("다른 회차의 가능 시간을 모으는 중입니다.");
      }
      const isSchedulable =
        game.roundScheduleKind === "coordinated" && schedulableRoundNo(rounds) === roundNo;
      const isReschedulable =
        !isNull(target.startAt) &&
        target.status === "scheduled" &&
        target.startAt.getTime() > now.getTime();
      if (!isSchedulable && !isReschedulable && target.status !== "coordinating") {
        throw new RoundScheduleError("가능 시간을 모을 수 없는 회차입니다.");
      }
      await openRoundCoordinationCommand({
        transaction,
        serverId,
        gameId,
        roundNo,
        start,
        end,
        windowStartHour,
        windowEndHour,
        timezone: "Asia/Seoul",
      });
      const confirmedUserIds = await listParticipantUserIds({
        transaction,
        serverId,
        gameId,
        status: PARTICIPANT_STATUS.confirmed,
      });
      await createNotifications({
        executor: transaction,
        serverId,
        actorId: game.gmId,
        notifications: confirmedUserIds.map((userId) => ({
          userId,
          kind: NOTIFICATION_KIND.roundAvailabilityRequested,
          params: { gameId, gameTitle: game.title, roundNo },
        })),
      });
      return {};
    },
  });
  if (!result.error && member) {
    after(() => notifyRoundAvailability({ server: member.server, gameId, roundNo }));
  }
  return result;
}
