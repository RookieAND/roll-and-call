import { isAttendancePastDeadline, isSessionEnded } from "@roll-and-call/database/games/model";

// 크론이 저장하기 전이라도 기한이 지났으면 전원 출석으로 정해진 것으로 본다.
export function isAttendanceSettled({
  game,
  confirmedCount,
  now = new Date(),
}: {
  game: Parameters<typeof isSessionEnded>[0] & { attendanceConfirmedAt: Date | string | null };
  confirmedCount: number;
  now?: Date;
}): boolean {
  if (game.attendanceConfirmedAt) return true;
  if (confirmedCount === 0 || !isSessionEnded(game, now)) return false;
  return isAttendancePastDeadline({ ...game, now });
}
