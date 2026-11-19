"use server";

import {
  listGameRoundsInTransaction,
  listParticipantUserIds,
  moveRounds,
  findGameRound,
  setRepeatRule,
} from "@roll-and-call/database/games";
import {
  PARTICIPANT_STATUS,
  repeatRuleOf,
  roundScheduleChangeNotices,
  roundTimeError,
} from "@roll-and-call/database/games/model";
import { createDelayedNotifications, UNDO_WINDOW_MS } from "@roll-and-call/database/notifications";
import { roundSpanText } from "@roll-and-call/database/notifications/model";
import { isEqual, isNull } from "es-toolkit";
import { after } from "next/server";
import { z } from "zod";

import { checkScheduleConflicts } from "@/entities/game/server";
import { idSchema, parseActionInput } from "@/shared/api";
import { getActingMember, notifyRoundChanged } from "@/shared/server";

import { guardRoundSchedule } from "./guard-round-schedule";
import { parseKstSpan } from "./parse-kst-span";
import { RoundScheduleError } from "./round-schedule-error";
import type { RoundScheduleResult } from "./round-schedule-result";

const inputSchema = z.object({
  gameId: idSchema,
  roundNo: z.number().int().min(1).max(52),
  startsAt: z.string(),
  endsAt: z.string(),
  moveLater: z.boolean(),
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 아직 시작하지 않은 회차의 일시를 옮긴다. 지정형은 이후 회차를 같은 간격만큼 함께 옮길 수 있다.
// 참여자 알림은 되돌리기 토스트가 사라진 뒤에 보이고, 스레드 안내도 그때까지 일정이 그대로일 때만 올린다.
export async function moveRoundSchedule(
  input: z.input<typeof inputSchema>,
): Promise<RoundScheduleResult> {
  const parsed = parseActionInput(inputSchema, input);
  if (!parsed.ok) return parsed.result;
  const { gameId, roundNo, moveLater } = parsed.data;
  const span = parseKstSpan(parsed.data);
  if (!span) return { error: "날짜와 시각을 확인해 주세요." };
  const member = await getActingMember();
  const result = await guardRoundSchedule({
    gameId,
    work: async ({ transaction, game, serverId }): Promise<RoundScheduleResult> => {
      if (moveLater && game.roundScheduleKind !== "designated") {
        throw new RoundScheduleError("지정형만 이후 회차를 함께 옮길 수 있습니다.");
      }
      const now = new Date();
      const rounds = await listGameRoundsInTransaction({ transaction, serverId, gameId });
      const target = rounds.find((round) => round.roundNo === roundNo);
      if (!target?.startAt || !target.plannedEndAt || target.startAt.getTime() <= now.getTime()) {
        throw new RoundScheduleError("이미 시작한 회차는 일정을 바꿀 수 없습니다.");
      }
      const shiftMs = span.startsAt.getTime() - target.startAt.getTime();
      const movedRounds = rounds
        .filter(
          (round) =>
            round.startAt &&
            round.plannedEndAt &&
            (round.roundNo === roundNo || (moveLater && round.roundNo > roundNo)),
        )
        .map((round) =>
          round.roundNo === roundNo
            ? { roundNo, startsAt: span.startsAt, endsAt: span.endsAt }
            : {
                roundNo: round.roundNo,
                startsAt: new Date(round.startAt!.getTime() + shiftMs),
                endsAt: new Date(round.plannedEndAt!.getTime() + shiftMs),
              },
        );
      const nextSequence = rounds.map((round) => {
        const moved = movedRounds.find((candidate) => candidate.roundNo === round.roundNo);
        return moved ? { ...round, startAt: moved.startsAt, plannedEndAt: moved.endsAt } : round;
      });
      for (const moved of movedRounds) {
        const index = nextSequence.findIndex((round) => round.roundNo === moved.roundNo);
        const error = roundTimeError({
          previousRound: nextSequence[index - 1],
          nextRound: nextSequence[index + 1],
          startsAt: moved.startsAt,
          endsAt: moved.endsAt,
          now,
        });
        if (!isNull(error)) throw new RoundScheduleError(error);
      }
      const confirmedUserIds = await listParticipantUserIds({
        transaction,
        serverId,
        gameId,
        status: PARTICIPANT_STATUS.confirmed,
      });
      const conflict = await checkScheduleConflicts({
        transaction,
        serverId,
        gameId,
        gmId: game.gmId,
        confirmedUserIds,
        rounds: movedRounds,
      });
      if (conflict) return { error: conflict.error, conflict };
      const previous = await moveRounds({
        transaction,
        serverId,
        gameId,
        moves: movedRounds.map((moved) => ({
          roundNo: moved.roundNo,
          startAt: moved.startsAt,
          plannedEndAt: moved.endsAt,
        })),
      });
      const previousRule = game.repeatRule ?? null;
      if (moveLater && previousRule) {
        const nextRule = repeatRuleOf({
          first: { startsAt: span.startsAt, endsAt: span.endsAt },
          intervalWeeks: previousRule.intervalWeeks,
        });
        if (!isEqual(nextRule, previousRule)) {
          await setRepeatRule({ transaction, serverId, gameId, repeatRule: nextRule });
        }
      }
      const [first, ...later] = movedRounds;
      const notificationIds = await createDelayedNotifications({
        transaction,
        serverId,
        actorId: game.gmId,
        visibleAt: new Date(now.getTime() + UNDO_WINDOW_MS),
        notifications: roundScheduleChangeNotices({
          game: { id: gameId, title: game.title },
          userIds: confirmedUserIds,
          moved: first!,
          later: moveLater ? { rounds: later, shiftMs } : undefined,
        }),
      });
      return {
        notificationIds,
        previous: previous.map((row) => ({
          roundNo: row.roundNo,
          startsAt: row.startAt.toISOString(),
          endsAt: row.plannedEndAt.toISOString(),
        })),
        repeatRule: previousRule,
      };
    },
  });
  if (!result.error && member) {
    const { server } = member;
    after(async () => {
      await sleep(UNDO_WINDOW_MS);
      const round = await findGameRound({ serverId: server.id, gameId, roundNo });
      if (round?.startAt?.getTime() !== span.startsAt.getTime()) return;
      const spanText = roundSpanText({
        startsAt: span.startsAt.toISOString(),
        endsAt: span.endsAt.toISOString(),
      });
      await notifyRoundChanged({
        server,
        gameId,
        description: `${roundNo}회차가 ${spanText}로 옮겨졌습니다.${moveLater ? " 이후 회차도 함께 옮겨졌습니다." : ""}`,
      });
    });
  }
  return result;
}
