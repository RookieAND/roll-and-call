import { cancelForMinPlayers } from "#/modules/games/commands/cancel-for-min-players";
import { markMinPlayersJudged } from "#/modules/games/commands/mark-min-players-judged";
import { cancelBlockReason } from "#/modules/games/model/cancel-block-reason";
import { countConfirmed } from "#/modules/games/model/count-confirmed";
import { judgeMinPlayers } from "#/modules/games/model/min-players-judgement";
import { RECRUIT_METHOD } from "#/modules/games/model/recruit-method";
import { listRosterStatuses } from "#/modules/games/queries/list-roster-statuses";
import { lockGame } from "#/modules/games/queries/lock-game";
import type { Transaction } from "#/modules/transaction/transaction";
import type { Game } from "#/schema";

export type JudgeMinPlayersResult =
  | { kind: "skipped" }
  | { kind: "passed" }
  | { kind: "cancelled"; game: Game };

// 선착순 글의 모집 마감 판정. 행을 잠근 뒤 판정 표시를 다시 보므로 동시에 와도 한 번만 처리된다.
// 대상이 아니거나 취소·세션 시작으로 잠긴 글은 표시를 채우지 않고 넘긴다. 추첨 글은 drawLottery가 판정한다.
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
  if (!game || game.recruitMethod !== RECRUIT_METHOD.firstCome) return { kind: "skipped" };
  if (game.endDate > now || cancelBlockReason({ game, now })) return { kind: "skipped" };

  const roster = await listRosterStatuses({ transaction, serverId, gameId });
  const judgement = judgeMinPlayers({
    recruitMethod: game.recruitMethod,
    minPlayers: game.minPlayers,
    confirmedCount: countConfirmed(roster.map((status) => ({ status }))),
    applicantCount: 0,
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
