import "server-only";
import type { Game } from "@roll-and-call/database";
import { lockGame } from "@roll-and-call/database/games";
import { withTransaction, type Transaction } from "@roll-and-call/database/transaction";

import {
  ERROR_DISPLAY,
  GAME_CANCELLED_MESSAGE,
  GAME_NOT_FOUND_MESSAGE,
  type ActionResult,
} from "@/shared/api";
import { getActingMember, notMemberError, revalidateGamePaths } from "@/shared/server";

import { RoundPlanError } from "./round-plan-error";

export type RoundPlanContext = { transaction: Transaction; game: Game; serverId: string };

// 회차 계획(회차 수·회차 추가·조기 종결)을 고치는 길이 거친다. 게임 행을 잠그고 GM 본인·다회차·진행 중인지 확인한다.
export async function guardRoundPlan<Result extends ActionResult>({
  gameId,
  work,
}: {
  gameId: string;
  work: (context: RoundPlanContext) => Promise<Result>;
}): Promise<Result | ActionResult> {
  const member = await getActingMember();
  if (!member) return { error: await notMemberError() };
  const serverId = member.server.id;
  let result: Result;
  try {
    result = await withTransaction(async (transaction) => {
      const game = await lockGame({ transaction, serverId, gameId });
      if (!game || game.roundCount < 2) {
        throw new RoundPlanError(GAME_NOT_FOUND_MESSAGE, ERROR_DISPLAY.page);
      }
      if (game.gmId !== member.user.id) throw new RoundPlanError("권한이 없습니다.");
      if (game.cancelledAt) throw new RoundPlanError(GAME_CANCELLED_MESSAGE);
      if (game.finishedAt) throw new RoundPlanError("이미 끝난 구인입니다.");
      return work({ transaction, game, serverId });
    });
  } catch (error) {
    if (error instanceof RoundPlanError) {
      return { error: error.message, errorDisplay: error.display };
    }
    throw error;
  }
  revalidateGamePaths({ slug: member.server.slug, gameId });
  return result;
}
