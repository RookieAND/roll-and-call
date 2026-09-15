import "server-only";
import { eq } from "drizzle-orm";

import { isSessionLocked } from "@/entities/game";
import {
  AUTH_REQUIRED_MESSAGE,
  ERROR_DISPLAY,
  GAME_NOT_FOUND_MESSAGE,
  type ActionResult,
} from "@/shared/api";
import { db, games, getCurrentUser, refreshRecruitPost, type Game } from "@/shared/server";

import { revalidateRoster } from "./revalidate-roster";
import { RosterError } from "./roster-error";
import type { Transaction } from "./transaction";

// 모든 명단 조정이 거치는 한 길: 게임 행을 잠근 트랜잭션 안에서 GM 본인·세션 잠기기 전을 확인한다.
export async function adjustRoster(
  gameId: string,
  work: (transaction: Transaction, game: Game) => Promise<void>,
  after?: () => Promise<void>,
): Promise<ActionResult> {
  const gmId = (await getCurrentUser())?.id;
  if (!gmId) return { error: AUTH_REQUIRED_MESSAGE };

  try {
    await db.transaction(async (transaction) => {
      const [game] = await transaction
        .select()
        .from(games)
        .where(eq(games.id, gameId))
        .for("update");
      if (!game) throw new RosterError(GAME_NOT_FOUND_MESSAGE, ERROR_DISPLAY.page);
      if (game.gmId !== gmId) throw new RosterError("권한이 없습니다.");
      if (isSessionLocked(game)) throw new RosterError("이미 확정된 게임입니다.");
      await work(transaction, game);
    });
  } catch (error) {
    if (error instanceof RosterError) return { error: error.message, errorDisplay: error.display };
    throw error;
  }

  revalidateRoster(gameId);
  await after?.();
  await refreshRecruitPost(gameId);
  return {};
}
