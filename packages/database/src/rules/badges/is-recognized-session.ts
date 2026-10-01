import { sessionEndsAt } from "./session-ends-at";

// 출석 확인 전에는 누가 불참인지 정해지지 않아 넣지 않는다.
export function isRecognizedSession(
  game: {
    confirmedAt: Date | null;
    playMinutes: number | null;
    attendanceConfirmedAt: Date | null;
    hiddenAt: Date | null;
  },
  confirmedCount: number,
  now: Date,
): boolean {
  if (!game.confirmedAt || !game.attendanceConfirmedAt || game.hiddenAt) return false;
  if (confirmedCount === 0) return false;
  return sessionEndsAt(game.confirmedAt, game.playMinutes).getTime() <= now.getTime();
}
