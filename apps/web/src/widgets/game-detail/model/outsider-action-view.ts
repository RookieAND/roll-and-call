import {
  isApplicationClosed,
  isSessionEnded,
  RECRUIT_METHOD,
  SCHEDULE_MODE,
} from "@/entities/game";

import { type ActionContext, GAME_ACTION_VIEW, type GameActionView } from "./game-action-view";
import { isRecruitmentClosed } from "./is-recruitment-closed";

// 참여 기록이 없는 사람: 끝남 → 모집 끝 → 제재 → 신청.
export function outsiderActionView({
  game,
  confirmedCount,
  waitingCount,
  sanction,
  now,
}: Omit<ActionContext, "viewer" | "review">): GameActionView {
  if (isSessionEnded(game, now)) return { kind: GAME_ACTION_VIEW.endedOther };
  if (game.scheduleMode === SCHEDULE_MODE.coordinate && isApplicationClosed(game, now)) {
    return { kind: GAME_ACTION_VIEW.closedScheduled, confirmedAt: game.confirmedAt! };
  }
  if (isRecruitmentClosed({ game, confirmedCount, now })) return { kind: GAME_ACTION_VIEW.closed };
  if (sanction) return { kind: GAME_ACTION_VIEW.sanctioned, ...sanction };
  if (game.recruitMethod === RECRUIT_METHOD.lottery) {
    return { kind: GAME_ACTION_VIEW.joinLottery, endDate: game.endDate };
  }
  if (game.recruitMethod === RECRUIT_METHOD.selection) {
    return { kind: GAME_ACTION_VIEW.joinSelection, endDate: game.endDate };
  }
  if (confirmedCount >= game.maxPlayers) {
    return { kind: GAME_ACTION_VIEW.joinWaitlist, nextRank: waitingCount + 1 };
  }
  return { kind: GAME_ACTION_VIEW.join };
}
