import { isAttendancePastDeadline, isSessionEnded } from "@roll-and-call/database/games/model";

// 기한이 지난 세션은 크론이 전원 출석으로 확정하므로 할 일이 아니다.
export function isAttendanceDue({
  game,
  confirmedCount,
  now = new Date(),
}: {
  game: Parameters<typeof isSessionEnded>[0] & { attendanceConfirmedAt: Date | string | null };
  confirmedCount: number;
  now?: Date;
}): boolean {
  if (game.attendanceConfirmedAt || confirmedCount === 0) return false;
  if (isAttendancePastDeadline({ ...game, now })) return false;
  return isSessionEnded(game, now);
}
