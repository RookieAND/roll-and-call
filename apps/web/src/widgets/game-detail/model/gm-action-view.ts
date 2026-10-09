import {
  CALENDAR_VIEWER_ROLE,
  canAddToCalendar,
  isAttendanceDue,
  isAttendancePastDeadline,
  isSessionEnded,
  isSessionInProgress,
} from "@/entities/game";
import { reviewWriteDeadline } from "@/entities/review";
import { ddayKst } from "@/shared/lib";

import { type ActionContext, GAME_ACTION_VIEW, type GameActionView } from "./game-action-view";
import { REVIEW_STATUS } from "./review-status";

// GM 하단 바: 끝남(출석) → 진행 중 → 시작 전. [세션 마치기]·[세션 시간 확정하기]는 두지 않는다(D242, D287).
export function gmActionView({
  game,
  confirmedCount,
  review,
  now,
}: Pick<ActionContext, "game" | "confirmedCount" | "review" | "now">): GameActionView {
  if (isSessionEnded(game, now)) {
    const attendanceDue = isAttendanceDue({ game, confirmedCount, now });
    const attendanceRecorded =
      confirmedCount > 0 &&
      (Boolean(game.attendanceConfirmedAt) || isAttendancePastDeadline({ ...game, now }));
    const writeFrom = game.attendanceFirstConfirmedAt ?? game.attendanceConfirmedAt;
    return {
      kind: GAME_ACTION_VIEW.gmEnded,
      attendanceDue,
      attendanceRecorded,
      endedOn: game.confirmedAt!,
      review,
      reviewDaysLeft:
        review === REVIEW_STATUS.writable && writeFrom
          ? ddayKst(reviewWriteDeadline(writeFrom), now)
          : null,
    };
  }
  if (isSessionInProgress(game, now))
    return { kind: GAME_ACTION_VIEW.gmLive, attendanceExpected: confirmedCount > 0 };
  const calendar = canAddToCalendar({ game, viewerRole: CALENDAR_VIEWER_ROLE.gm, now });
  return { kind: GAME_ACTION_VIEW.gmUpcoming, calendar };
}
