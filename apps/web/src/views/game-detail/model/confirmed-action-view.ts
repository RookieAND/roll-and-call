import { isNil } from "es-toolkit";

import {
  CALENDAR_VIEWER_ROLE,
  canAddToCalendar,
  CONFIRMED_LEAVE_BLOCK,
  confirmedLeaveBlock,
  isApplicationClosed,
  isSessionEnded,
  isSessionInProgress,
  SCHEDULE_MODE,
} from "@/entities/game";

import { type ActionContext, GAME_ACTION_VIEW, type GameActionView } from "./game-action-view";

// 확정 참여자: 끝남 → 일정 확정(신청 닫힘) → 취소 가능 → 취소 불가.
export function confirmedActionView({
  game,
  confirmedCount,
  waitingCount,
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

  const coordinate = game.scheduleMode === SCHEDULE_MODE.coordinate;
  const drawn = !isNil(game.drawnAt);
  const calendar = canAddToCalendar({ game, viewerRole: CALENDAR_VIEWER_ROLE.confirmed, now });

  if (isApplicationClosed(game, now)) {
    // 한 줄에 버튼은 둘까지라 추첨 뒤에는 [일정 보기] 대신 [결과 보러 가기]를 둔다.
    return {
      kind: GAME_ACTION_VIEW.scheduled,
      confirmedAt: game.confirmedAt!,
      live: isSessionInProgress(game, now),
      resultLink: drawn,
      scheduleLink: coordinate && !drawn,
      calendar,
    };
  }

  const block = confirmedLeaveBlock({ game, confirmedCount, waitingCount, now });
  if (!block || block === CONFIRMED_LEAVE_BLOCK.schedule) {
    return {
      kind: GAME_ACTION_VIEW.confirmedOpen,
      confirmedAt: game.confirmedAt,
      resultLink: false,
      scheduleLink: coordinate,
      calendar,
    };
  }
  return {
    kind: GAME_ACTION_VIEW.confirmedLocked,
    block,
    resultLink: drawn,
    scheduleLink: coordinate,
    calendar,
  };
}
