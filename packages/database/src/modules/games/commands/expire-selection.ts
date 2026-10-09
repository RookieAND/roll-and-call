import { cancelGame } from "#/modules/games/commands/cancel-game";
import { GAME_CANCEL_KIND } from "#/modules/games/model/game-cancel-kind";
import { RECRUIT_METHOD } from "#/modules/games/model/recruit-method";
import { selectionDeadline } from "#/modules/games/model/selection-deadline";
import { lockGame } from "#/modules/games/queries/lock-game";
import type { Transaction } from "#/modules/transaction/transaction";
import type { Game } from "#/schema";

export type ExpireSelectionResult = { kind: "skipped" } | { kind: "expired"; game: Game };

const MS = 1;

// 기한 안에 선발을 마치지 않은 글을 자동으로 취소한다. 확정자가 있어도 취소한다(D403).
// 행을 잠근 뒤 다시 확인하므로 [선발 마치기]와 동시에 와도 먼저 끝난 쪽 하나만 적용된다.
export async function expireSelection({
  transaction,
  serverId,
  gameId,
  now,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  now: Date;
}): Promise<ExpireSelectionResult> {
  const game = await lockGame({ transaction, serverId, gameId });
  if (!game || game.recruitMethod !== RECRUIT_METHOD.selection) return { kind: "skipped" };
  if (game.selectionFinishedAt || game.cancelledAt) return { kind: "skipped" };
  const deadline = selectionDeadline(game);
  if (deadline.getTime() > now.getTime()) return { kind: "skipped" };

  // 일시 지정형의 기한은 세션 시작 시각이라, 시작한 세션은 취소하지 않는다는 규칙에 걸리지 않게 기한 직전 시각으로 취소한다.
  const cancelledAt = new Date(Math.min(now.getTime(), deadline.getTime() - MS));
  const cancelled = await cancelGame({
    transaction,
    serverId,
    gameId,
    kind: GAME_CANCEL_KIND.selectionExpired,
    actorId: null,
    reason: null,
    now: cancelledAt,
  });
  return cancelled.ok ? { kind: "expired", game: cancelled.game } : { kind: "skipped" };
}
