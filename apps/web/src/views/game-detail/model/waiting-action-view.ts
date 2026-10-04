import { isNil } from "es-toolkit";

import { isSessionEnded, RECRUIT_METHOD } from "@/entities/game";

import { type ActionContext, GAME_ACTION_VIEW, type GameActionView } from "./game-action-view";

// 추첨 전 waiting은 순번 없는 신청자, 그 밖은 대기자다. 끝난 세션의 대기자에게는 [대기 취소]가 없다(D264).
export function waitingActionView({
  game,
  viewer,
  waitingCount,
  now,
}: Pick<ActionContext, "game" | "viewer" | "waitingCount" | "now">): GameActionView {
  if (isSessionEnded(game, now)) return { kind: GAME_ACTION_VIEW.endedOther };
  const isLottery = game.recruitMethod === RECRUIT_METHOD.lottery;
  if (isLottery && isNil(game.drawnAt)) {
    return {
      kind: GAME_ACTION_VIEW.lotteryApplied,
      endDate: game.endDate,
      closed: game.endDate.getTime() <= now.getTime(),
    };
  }
  return {
    kind: GAME_ACTION_VIEW.waiting,
    rank: viewer.waitlistRank ?? waitingCount,
    resultLink: isLottery,
  };
}
