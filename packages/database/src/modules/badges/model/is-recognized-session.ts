import { isSessionEnded } from "#/modules/games/model/session-timing";

// 출석 확인 전에는 누가 불참인지 정해지지 않아 넣지 않는다.
export function isRecognizedSession({
  game,
  confirmedCount,
  now,
}: {
  game: {
    confirmedAt: Date | null;
    playMinutes: number | null;
    endedAt: Date | null;
    attendanceConfirmedAt: Date | null;
    hiddenAt: Date | null;
    cancelledAt: Date | null;
  };
  confirmedCount: number;
  now: Date;
}): boolean {
  if (!game.confirmedAt || !game.attendanceConfirmedAt || game.hiddenAt || game.cancelledAt)
    return false;
  if (confirmedCount === 0) return false;
  return isSessionEnded(game, now);
}
