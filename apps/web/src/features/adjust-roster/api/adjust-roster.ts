import "server-only";
import { lockGame } from "@roll-and-call/database/games";
import { withTransaction, type Transaction } from "@roll-and-call/database/transaction";
import { after } from "next/server";

import { isSessionLocked } from "@/entities/game";
import {
  AUTH_REQUIRED_MESSAGE,
  ERROR_DISPLAY,
  GAME_NOT_FOUND_MESSAGE,
  type ActionResult,
} from "@/shared/api";
import {
  getCurrentServer,
  getCurrentUser,
  refreshRecruitPost,
  type Game,
  type Server,
} from "@/shared/server";

import { revalidateRoster } from "./revalidate-roster";
import { RosterError } from "./roster-error";

// 모든 명단 조정이 거치는 한 길: 게임 행을 잠근 트랜잭션 안에서 GM 본인·세션 잠기기 전을 확인한다.
export async function adjustRoster({
  gameId,
  work,
  notify,
}: {
  gameId: string;
  work: (transaction: Transaction, game: Game) => Promise<void>;
  notify?: (server: Server) => Promise<void>;
}): Promise<ActionResult> {
  const gmId = (await getCurrentUser())?.id;
  if (!gmId) return { error: AUTH_REQUIRED_MESSAGE };
  const server = await getCurrentServer();

  try {
    await withTransaction(async (transaction) => {
      const game = await lockGame({ transaction, serverId: server.id, gameId });
      if (!game) throw new RosterError(GAME_NOT_FOUND_MESSAGE, ERROR_DISPLAY.page);
      if (game.gmId !== gmId) throw new RosterError("권한이 없습니다.");
      if (isSessionLocked(game)) throw new RosterError("이미 확정된 게임입니다.");
      await work(transaction, game);
    });
  } catch (error) {
    if (error instanceof RosterError) return { error: error.message, errorDisplay: error.display };
    throw error;
  }

  revalidateRoster({ slug: server.slug, gameId });
  after(async () => {
    await notify?.(server);
    await refreshRecruitPost({ server, gameId });
  });
  return {};
}
