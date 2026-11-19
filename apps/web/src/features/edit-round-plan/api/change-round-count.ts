"use server";

import {
  listGameRoundsInTransaction,
  listParticipantUserIds,
  setRoundCount,
} from "@roll-and-call/database/games";
import {
  PARTICIPANT_STATUS,
  ROUND_COUNT_MAX,
  ROUND_COUNT_MIN,
  roundCountChange,
} from "@roll-and-call/database/games/model";
import { createNotifications, NOTIFICATION_KIND } from "@roll-and-call/database/notifications";
import { z } from "zod";

import { idSchema, parseActionInput, type ActionResult } from "@/shared/api";

import { startedRoundNos } from "../model/started-round-nos";
import { finishWithNotices } from "./finish-with-notices";
import { guardRoundPlan } from "./guard-round-plan";
import { RoundPlanError } from "./round-plan-error";

const inputSchema = z.object({ gameId: idSchema, next: z.number().int() });

// 예정 회차 수를 바꾼다. 시작한 회차 수와 같게 줄이면 조기 종결이고, 지정형을 늘리는 것은 [회차 추가]로 한다.
export async function changeRoundCount(input: z.input<typeof inputSchema>): Promise<ActionResult> {
  const parsed = parseActionInput(inputSchema, input);
  if (!parsed.ok) return parsed.result;
  const { gameId, next } = parsed.data;
  return guardRoundPlan({
    gameId,
    work: async ({ transaction, game, serverId }) => {
      const now = new Date();
      const rounds = await listGameRoundsInTransaction({ transaction, serverId, gameId });
      const started = startedRoundNos({ rounds, now });
      const current = game.roundCount;
      const change = roundCountChange({ current, next, startedCount: started.length });
      if (change === "invalid") {
        throw new RoundPlanError(
          next > ROUND_COUNT_MAX
            ? `예정 회차 수는 ${ROUND_COUNT_MAX}회까지입니다.`
            : `이미 시작한 ${started.length}회보다 적게 줄일 수 없습니다.`,
        );
      }
      if (change === "same") return {};
      if (change === "finish") {
        await finishWithNotices({
          transaction,
          serverId,
          game,
          lastRoundNo: started.at(-1)!,
          at: now,
        });
        return {};
      }
      if (next < ROUND_COUNT_MIN) {
        throw new RoundPlanError(`예정 회차 수는 ${ROUND_COUNT_MIN}회보다 적게 줄일 수 없습니다.`);
      }
      if (game.roundScheduleKind === "designated" && next > current) {
        throw new RoundPlanError("지정형은 회차 추가로 늘려 주세요.");
      }
      await setRoundCount({ transaction, serverId, gameId, current, next });
      const userIds = await listParticipantUserIds({
        transaction,
        serverId,
        gameId,
        status: PARTICIPANT_STATUS.confirmed,
      });
      await createNotifications({
        executor: transaction,
        serverId,
        actorId: game.gmId,
        notifications: userIds.map((userId) => ({
          userId,
          kind: NOTIFICATION_KIND.roundCountChanged,
          params: { gameId, gameTitle: game.title, previousCount: current, nextCount: next },
        })),
      });
      return {};
    },
  });
}
