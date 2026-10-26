import { isAttendancePastDeadline } from "./attendance-deadline";
import { isSessionStarted } from "./session-timing";

type Moment = Date | string | null;

// 출석 입력과 확정은 시작 시각부터 종료 24시간 뒤 기한 전까지 한다. 이미 확정한 구인을 다시 고치는 길도 같은 판단을 쓴다.
export function canConfirmAttendance({
  game,
  confirmedCount,
  now,
}: {
  game: { confirmedAt: Moment; playMinutes: number | null; endedAt: Moment };
  confirmedCount: number;
  now: Date;
}): boolean {
  if (confirmedCount === 0 || !isSessionStarted(game, now)) return false;
  return !isAttendancePastDeadline({ ...game, now });
}
