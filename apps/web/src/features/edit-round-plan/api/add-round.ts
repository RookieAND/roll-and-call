"use server";

import {
  addRound as appendRound,
  listGameRoundsInTransaction,
  listParticipantUserIds,
} from "@roll-and-call/database/games";
import { PARTICIPANT_STATUS } from "@roll-and-call/database/games/model";
import {
  createDelayedNotifications,
  NOTIFICATION_KIND,
  UNDO_WINDOW_MS,
} from "@roll-and-call/database/notifications";
import { isNull } from "es-toolkit";
import { z } from "zod";

import { checkScheduleConflicts } from "@/entities/game/server";
import { idSchema, parseActionInput, type ActionResult } from "@/shared/api";
import { fromKstDateTimeInput } from "@/shared/lib";

import { addRoundError } from "../model/add-round-error";
import { guardRoundPlan } from "./guard-round-plan";
import { RoundPlanError } from "./round-plan-error";

const inputSchema = z.object({ gameId: idSchema, startsAt: z.string(), endsAt: z.string() });

export type AddRoundResult = ActionResult & { roundNo?: number; notificationIds?: string[] };

// 지정형 다회차에 회차를 하나 덧붙인다. 참여자 알림은 되돌리기 토스트가 사라진 뒤에 보인다.
export async function addRound(input: z.input<typeof inputSchema>): Promise<AddRoundResult> {
  const parsed = parseActionInput(inputSchema, input);
  if (!parsed.ok) return parsed.result;
  const { gameId } = parsed.data;
  const startsAt = fromKstDateTimeInput(parsed.data.startsAt);
  const endsAt = fromKstDateTimeInput(parsed.data.endsAt);
  if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
    return { error: "날짜와 시각을 확인해 주세요." };
  }
  return guardRoundPlan({
    gameId,
    work: async ({ transaction, game, serverId }): Promise<AddRoundResult> => {
      if (game.roundScheduleKind !== "designated") {
        throw new RoundPlanError("지정형만 회차를 더할 수 있습니다.");
      }
      const now = new Date();
      const rounds = await listGameRoundsInTransaction({ transaction, serverId, gameId });
      const error = addRoundError({ lastRound: rounds.at(-1), startsAt, endsAt, now });
      if (!isNull(error)) throw new RoundPlanError(error);
      const confirmedUserIds = await listParticipantUserIds({
        transaction,
        serverId,
        gameId,
        status: PARTICIPANT_STATUS.confirmed,
      });
      const roundNo = game.roundCount + 1;
      const rejection = await checkScheduleConflicts({
        transaction,
        serverId,
        gameId,
        gmId: game.gmId,
        confirmedUserIds,
        rounds: [{ roundNo, startsAt, endsAt }],
      });
      if (rejection) throw new RoundPlanError(rejection.error);
      await appendRound({ transaction, serverId, gameId, startAt: startsAt, plannedEndAt: endsAt });
      const notificationIds = await createDelayedNotifications({
        transaction,
        serverId,
        actorId: game.gmId,
        visibleAt: new Date(now.getTime() + UNDO_WINDOW_MS),
        notifications: confirmedUserIds.map((userId) => ({
          userId,
          kind: NOTIFICATION_KIND.roundCountChanged,
          params: {
            gameId,
            gameTitle: game.title,
            previousCount: game.roundCount,
            nextCount: roundNo,
          },
        })),
      });
      return { roundNo, notificationIds };
    },
  });
}
