import { isSessionEnded } from "./is-session-ended";

export function isAttendanceDue(
  game: Parameters<typeof isSessionEnded>[0] & { attendanceConfirmedAt: Date | string | null },
  confirmedCount: number,
  now: Date = new Date(),
): boolean {
  if (game.attendanceConfirmedAt || confirmedCount === 0) return false;
  return isSessionEnded(game, now);
}
