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

import { RoundScheduleError } from "./round-schedule-error";

export type RoundScheduleContext = { transaction: Transaction; game: Game; serverId: string };

// 회차 일정(정하기·옮기기·되돌리기)이 거친다. 게임 행을 잠그고 GM 본인·다회차·진행 중인지 확인한다.
export async function guardRoundSchedule<Result extends ActionResult>({
  gameId,
  work,
}: {
  gameId: string;
  work: (context: RoundScheduleContext) => Promise<Result>;
}): Promise<Result | ActionResult> {
  const member = await getActingMember();
  if (!member) return { error: await notMemberError() };
  const serverId = member.server.id;
  let result: Result;
  try {
    result = await withTransaction(async (transaction) => {
      const game = await lockGame({ transaction, serverId, gameId });
      if (!game || game.roundCount < 2) {
        throw new RoundScheduleError(GAME_NOT_FOUND_MESSAGE, ERROR_DISPLAY.page);
      }
      if (game.gmId !== member.user.id) throw new RoundScheduleError("권한이 없습니다.");
      if (game.cancelledAt) throw new RoundScheduleError(GAME_CANCELLED_MESSAGE);
      if (game.finishedAt) throw new RoundScheduleError("이미 끝난 구인입니다.");
      return work({ transaction, game, serverId });
    });
  } catch (error) {
    if (error instanceof RoundScheduleError) {
      return { error: error.message, errorDisplay: error.display };
    }
    throw error;
  }
  revalidateGamePaths({ slug: member.server.slug, gameId });
  return result;
}
