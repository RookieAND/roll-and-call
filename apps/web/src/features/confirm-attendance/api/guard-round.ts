import "server-only";
import type { Game, GameRound } from "@roll-and-call/database";
import { findGameRound, lockGame } from "@roll-and-call/database/games";
import { withTransaction, type Transaction } from "@roll-and-call/database/transaction";

import {
  ERROR_DISPLAY,
  GAME_CANCELLED_MESSAGE,
  GAME_NOT_FOUND_MESSAGE,
  type ActionResult,
} from "@/shared/api";
import { revalidateGamePaths } from "@/shared/server";

import type { AttendanceActor } from "../model/attendance-actor";
import { AttendanceError } from "./attendance-error";

const ROUND_NOT_FOUND_MESSAGE = "회차를 찾을 수 없습니다.";

// 다회차 회차를 건드리는 길(출석 확정·생략)이 거친다. 게임 행을 잠그고 GM 본인·다회차·회차가 있는지 확인한다.
export async function guardRound({
  actor,
  gameId,
  roundNo,
  work,
}: {
  actor: AttendanceActor;
  gameId: string;
  roundNo: number;
  work: (transaction: Transaction, game: Game, round: GameRound) => Promise<void>;
}): Promise<ActionResult> {
  const { serverId, slug, gmId } = actor;
  try {
    await withTransaction(async (transaction) => {
      const game = await lockGame({ transaction, serverId, gameId });
      if (!game || game.roundCount < 2) {
        throw new AttendanceError(GAME_NOT_FOUND_MESSAGE, ERROR_DISPLAY.page);
      }
      if (game.gmId !== gmId) throw new AttendanceError("권한이 없습니다.");
      if (game.cancelledAt) throw new AttendanceError(GAME_CANCELLED_MESSAGE);
      const round = await findGameRound({ transaction, serverId, gameId, roundNo });
      if (!round) throw new AttendanceError(ROUND_NOT_FOUND_MESSAGE, ERROR_DISPLAY.page);
      await work(transaction, game, round);
    });
  } catch (error) {
    if (error instanceof AttendanceError) {
      return { error: error.message, errorDisplay: error.display };
    }
    throw error;
  }
  revalidateGamePaths({ slug, gameId });
  return {};
}
