import { cancelForMinPlayers } from "#db/modules/games/commands/cancel-for-min-players";
import { markMinPlayersJudged } from "#db/modules/games/commands/mark-min-players-judged";
import { cancelBlockReason } from "#db/modules/games/model/cancel-block-reason";
import { countConfirmed } from "#db/modules/games/model/count-confirmed";
import { countWaiting } from "#db/modules/games/model/count-waiting";
import { judgeMinPlayers } from "#db/modules/games/model/min-players-judgement";
import { RECRUIT_METHOD } from "#db/modules/games/model/recruit-method";
import { listRosterStatuses } from "#db/modules/games/queries/list-roster-statuses";
import { lockGame } from "#db/modules/games/queries/lock-game";
import type { Transaction } from "#db/modules/transaction";
import type { Game } from "#db/schema";

export type JudgeMinPlayersResult =
  | { kind: "skipped" }
  | { kind: "passed" }
  | { kind: "cancelled"; game: Game };

// 선착순·선발 글의 모집 마감 판정. 행을 잠근 뒤 판정 표시를 다시 보므로 동시에 와도 한 번만 처리된다.
// 대상이 아니거나 취소·세션 시작으로 잠긴 글은 표시를 채우지 않고 넘긴다. 추첨 글은 drawLottery가 판정한다. 선발은 마치기 전까지만 판정한다(마치면 그때 표시를 채운다).
export async function judgeMinPlayersForGame({
  transaction,
  serverId,
  gameId,
  now,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  now: Date;
}): Promise<JudgeMinPlayersResult> {
  const game = await lockGame({ transaction, serverId, gameId });
  if (!game || game.recruitMethod === RECRUIT_METHOD.lottery) return { kind: "skipped" };
  if (game.selectionFinishedAt) return { kind: "skipped" };
  if (game.endDate > now || cancelBlockReason({ game, now })) return { kind: "skipped" };

  const roster = await listRosterStatuses({ transaction, serverId, gameId });
  const judgement = judgeMinPlayers({
    recruitMethod: game.recruitMethod,
    minPlayers: game.minPlayers,
    confirmedCount: countConfirmed(roster.map((status) => ({ status }))),
    applicantCount: countWaiting(roster.map((status) => ({ status }))),
    judgedAt: game.minPlayersJudgedAt,
  });
  if (judgement === "skip") return { kind: "skipped" };
  if (judgement === "pass") {
    await markMinPlayersJudged({ transaction, serverId, gameId, at: now });
    return { kind: "passed" };
  }
  const cancelled = await cancelForMinPlayers({ transaction, serverId, gameId, now });
  return cancelled.ok ? { kind: "cancelled", game: cancelled.game } : { kind: "skipped" };
}
