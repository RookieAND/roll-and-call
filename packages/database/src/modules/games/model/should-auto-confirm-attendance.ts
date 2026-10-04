import { isNull } from "es-toolkit";

import { isAttendancePastDeadline } from "./attendance-deadline";

// 시작했고 한 번도 출석을 확정하지 않은, 확정 참여자가 있는 세션만 자동 확정한다. 매일 크론은 기한이 지난 것만 고른다.
export function shouldAutoConfirmAttendance({
  game,
  confirmedCount,
  now,
  onlyPastDeadline,
}: {
  game: {
    confirmedAt: Date | null;
    playMinutes: number | null;
    endedAt: Date | null;
    attendanceConfirmedAt: Date | null;
    attendanceFirstConfirmedAt: Date | null;
    cancelledAt: Date | null;
  };
  confirmedCount: number;
  now: Date;
  onlyPastDeadline: boolean;
}): boolean {
  if (isNull(game.confirmedAt) || !isNull(game.attendanceConfirmedAt)) return false;
  if (!isNull(game.attendanceFirstConfirmedAt)) return false;
  if (!isNull(game.cancelledAt) || confirmedCount === 0) return false;
  if (game.confirmedAt.getTime() > now.getTime()) return false;
  return !onlyPastDeadline || isAttendancePastDeadline({ ...game, now });
}
