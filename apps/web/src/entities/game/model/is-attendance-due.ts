import { isSessionEnded } from "./is-session-ended";

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
  return isSessionEnded(game, now);
}
