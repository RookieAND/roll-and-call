import { isSessionEnded } from "./is-session-ended";

// 세션이 끝난 뒤부터 GM에게 남는 일. 확정 참여자가 없으면 정할 것이 없다.
export function isAttendanceDue(
  game: Parameters<typeof isSessionEnded>[0] & { attendanceConfirmedAt: Date | string | null },
  confirmedCount: number,
  now: Date = new Date(),
): boolean {
  if (game.attendanceConfirmedAt || confirmedCount === 0) return false;
  return isSessionEnded(game, now);
}
