import { isNil } from "es-toolkit";

import {
  CALENDAR_VIEWER_ROLE,
  canAddToCalendar,
  CONFIRMED_LEAVE_BLOCK,
  confirmedLeaveBlock,
  isApplicationClosed,
  isSessionEnded,
  isSessionInProgress,
} from "@/entities/game";

import { type ActionContext, GAME_ACTION_VIEW, type GameActionView } from "./game-action-view";

// 확정 참여자: 끝남 → 일정 확정(신청 닫힘) → 취소 가능 → 취소 불가.
export function confirmedActionView({
  game,
  confirmedCount,
  waitingCount,
  lotteryHeld,
  review,
  now,
}: Omit<ActionContext, "viewer" | "sanction">): GameActionView {
  if (isSessionEnded(game, now)) {
    return {
      kind: GAME_ACTION_VIEW.endedParticipant,
      endedOn: game.confirmedAt!,
      attendanceConfirmed: !isNil(game.attendanceConfirmedAt),
      review,
    };
  }

  const drawn = !isNil(game.drawnAt) && lotteryHeld;
  const calendar = canAddToCalendar({ game, viewerRole: CALENDAR_VIEWER_ROLE.confirmed, now });

  if (isApplicationClosed(game, now)) {
    return {
      kind: GAME_ACTION_VIEW.scheduled,
      confirmedAt: game.confirmedAt!,
      live: isSessionInProgress(game, now),
      resultLink: drawn,
      calendar,
    };
  }

  const block = confirmedLeaveBlock({ game, confirmedCount, waitingCount, now });
  if (!block || block === CONFIRMED_LEAVE_BLOCK.schedule) {
    return {
      kind: GAME_ACTION_VIEW.confirmedOpen,
      confirmedAt: game.confirmedAt,
      resultLink: false,
      calendar,
    };
  }
  return {
    kind: GAME_ACTION_VIEW.confirmedLocked,
    block,
    resultLink: drawn,
    calendar,
  };
}
