"use server";

import { listGameRoundsInTransaction } from "@roll-and-call/database/games";

import { idSchema, parseActionInput, type ActionResult } from "@/shared/api";

import { startedRoundNos } from "../model/started-round-nos";
import { finishWithNotices } from "./finish-with-notices";
import { guardRoundPlan } from "./guard-round-plan";
import { RoundPlanError } from "./round-plan-error";

// [여기서 마치기]. 시작하지 않은 회차를 지우고 구인을 마친다. 끝까지 남은 참여자가 완주다.
export async function finishEarly(gameId: string): Promise<ActionResult> {
  const parsed = parseActionInput(idSchema, gameId);
  if (!parsed.ok) return parsed.result;
  return guardRoundPlan({
    gameId: parsed.data,
    work: async ({ transaction, game, serverId }) => {
      const now = new Date();
      const rounds = await listGameRoundsInTransaction({ transaction, serverId, gameId: game.id });
      const started = startedRoundNos({ rounds, now });
      if (started.length === 0) throw new RoundPlanError("아직 시작한 회차가 없습니다.");
      await finishWithNotices({
        transaction,
        serverId,
        game,
        lastRoundNo: started.at(-1)!,
        at: now,
      });
      return {};
    },
  });
}
