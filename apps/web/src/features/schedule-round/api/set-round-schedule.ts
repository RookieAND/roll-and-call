"use server";

import {
  listGameRoundsInTransaction,
  listParticipantUserIds,
  scheduleRound,
} from "@roll-and-call/database/games";
import {
  PARTICIPANT_STATUS,
  roundTimeError,
  schedulableRoundNo,
} from "@roll-and-call/database/games/model";
import { createNotifications, NOTIFICATION_KIND } from "@roll-and-call/database/notifications";
import { roundSpanText } from "@roll-and-call/database/notifications/model";
import { isNull } from "es-toolkit";
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
});

// 조율형에서 일정 없는 가장 앞 회차의 일시를 정한다. 확정 참여자에게는 바로 알린다.
export async function setRoundSchedule(
  input: z.input<typeof inputSchema>,
): Promise<RoundScheduleResult> {
  const parsed = parseActionInput(inputSchema, input);
  if (!parsed.ok) return parsed.result;
  const { gameId, roundNo } = parsed.data;
  const span = parseKstSpan(parsed.data);
  if (!span) return { error: "날짜와 시각을 확인해 주세요." };
  const member = await getActingMember();
  const result = await guardRoundSchedule({
    gameId,
    work: async ({ transaction, game, serverId }): Promise<RoundScheduleResult> => {
      if (game.roundScheduleKind !== "coordinated") {
        throw new RoundScheduleError("조율형만 회차 일정을 정할 수 있습니다.");
      }
      const rounds = await listGameRoundsInTransaction({ transaction, serverId, gameId });
      if (schedulableRoundNo(rounds) !== roundNo) {
        throw new RoundScheduleError("일정 없는 가장 앞 회차만 정할 수 있습니다.");
      }
      const error = roundTimeError({
        previousRound: rounds.find((round) => round.roundNo === roundNo - 1),
        nextRound: rounds.find((round) => round.roundNo === roundNo + 1),
        startsAt: span.startsAt,
        endsAt: span.endsAt,
        now: new Date(),
      });
      if (!isNull(error)) throw new RoundScheduleError(error);
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
        rounds: [{ roundNo, startsAt: span.startsAt, endsAt: span.endsAt }],
      });
      if (conflict) return { error: conflict.error, conflict };
      await scheduleRound({
        transaction,
        serverId,
        gameId,
        roundNo,
        startAt: span.startsAt,
        plannedEndAt: span.endsAt,
      });
      await createNotifications({
        executor: transaction,
        serverId,
        actorId: game.gmId,
        notifications: confirmedUserIds.map((userId) => ({
          userId,
          kind: NOTIFICATION_KIND.roundScheduleSet,
          params: {
            gameId,
            gameTitle: game.title,
            roundNo,
            startsAt: span.startsAt.toISOString(),
            endsAt: span.endsAt.toISOString(),
          },
        })),
      });
      return {};
    },
  });
  if (!result.error && member) {
    after(() =>
      notifyRoundChanged({
        server: member.server,
        gameId,
        description: `${roundNo}회차 일정이 정해졌습니다. ${roundSpanText({
          startsAt: span.startsAt.toISOString(),
          endsAt: span.endsAt.toISOString(),
        })}`,
      }),
    );
  }
  return result;
}
