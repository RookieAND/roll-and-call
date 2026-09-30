import { sessionEndsAt } from "./session-ends-at";

// 뱃지에 들어가는 세션: 끝났고, 출석 확인을 마쳤고, 숨겨지지 않았고, 확정 참여자가 있다.
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
