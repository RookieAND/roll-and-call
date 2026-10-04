import {
  CALENDAR_VIEWER_ROLE,
  canAddToCalendar,
  isAttendanceDue,
  isAttendancePastDeadline,
  isSessionEnded,
  isSessionInProgress,
} from "@/entities/game";

import { type ActionContext, GAME_ACTION_VIEW, type GameActionView } from "./game-action-view";

// GM 하단 바: 끝남(출석) → 진행 중 → 시작 전. [세션 마치기]·[세션 시간 확정하기]는 두지 않는다(D242, D287).
export function gmActionView({
  game,
  confirmedCount,
  now,
}: Pick<ActionContext, "game" | "confirmedCount" | "now">): GameActionView {
  if (isSessionEnded(game, now)) {
    const attendanceDue = isAttendanceDue({ game, confirmedCount, now });
    const attendanceRecorded =
      confirmedCount > 0 &&
      (Boolean(game.attendanceConfirmedAt) || isAttendancePastDeadline({ ...game, now }));
    return { kind: GAME_ACTION_VIEW.gmEnded, attendanceDue, attendanceRecorded };
  }
  if (isSessionInProgress(game, now)) return { kind: GAME_ACTION_VIEW.gmLive };
  const calendar = canAddToCalendar({ game, viewerRole: CALENDAR_VIEWER_ROLE.gm, now });
  return { kind: GAME_ACTION_VIEW.gmUpcoming, calendar };
}
