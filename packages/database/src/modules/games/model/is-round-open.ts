import { isNil, isNull } from "es-toolkit";

import { roundAttendanceDeadline } from "./round-attendance-deadline";

type Moment = Date | string | null;

// 회차 시작부터 종료 24시간 뒤까지. 회차 출석 입력·확정·다시 고치기와 생략이 이 기간에만 열린다.
export function isRoundOpen({
  round,
  now,
}: {
  round: { startAt: Moment; plannedEndAt: Moment; endedAt: Moment };
  now: Date;
}): boolean {
  if (isNil(round.startAt) || new Date(round.startAt).getTime() > now.getTime()) return false;
  const deadline = roundAttendanceDeadline(round);
  return !isNull(deadline) && now.getTime() < deadline.getTime();
}
