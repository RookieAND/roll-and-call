import { cancelGame } from "#/modules/games/commands/cancel-game";
import { markMinPlayersJudged } from "#/modules/games/commands/mark-min-players-judged";
import { GAME_CANCEL_KIND } from "#/modules/games/model/game-cancel-kind";
import type { Transaction } from "#/modules/transaction/transaction";

// 최소 인원 미달로 취소한다. 판정 표시와 취소를 같은 트랜잭션에서 하므로 둘 다 되거나 둘 다 안 된다.
export async function cancelForMinPlayers({
  transaction,
  serverId,
  gameId,
  now,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  now: Date;
}) {
  await markMinPlayersJudged({ transaction, serverId, gameId, at: now });
  return cancelGame({
    transaction,
    serverId,
    gameId,
    kind: GAME_CANCEL_KIND.minPlayersUnmet,
    actorId: null,
    reason: null,
    now,
  });
}
