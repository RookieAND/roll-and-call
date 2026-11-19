import { roundEndAt } from "@roll-and-call/database/games/model";
import { isNil } from "es-toolkit";

const HOUR_MS = 3_600_000;
const ROUND_MAX_HOURS = 24;

type Moment = Date | string | null;

// 지정형 회차 추가의 입력 오류. 맨 뒤 회차 뒤에만 붙이고, 마지막 회차 출석을 확정한 뒤에는 막는다.
export function addRoundError({
  lastRound,
  startsAt,
  endsAt,
  now,
}: {
  lastRound: { plannedEndAt: Moment; endedAt: Moment; attendanceConfirmedAt: Moment } | undefined;
  startsAt: Date;
  endsAt: Date;
  now: Date;
}): string | null {
  if (lastRound && !isNil(lastRound.attendanceConfirmedAt)) {
    return "마지막 회차 출석을 확정한 뒤에는 회차를 더할 수 없습니다.";
  }
  if (endsAt.getTime() <= startsAt.getTime()) return "종료 시각은 시작 시각보다 뒤여야 합니다.";
  if (endsAt.getTime() - startsAt.getTime() > ROUND_MAX_HOURS * HOUR_MS) {
    return "한 회차는 24시간을 넘을 수 없습니다.";
  }
  if (startsAt.getTime() <= now.getTime()) return "지난 시각에는 회차를 더할 수 없습니다.";
  const lastEnd = lastRound ? roundEndAt(lastRound) : null;
  if (lastEnd && startsAt.getTime() < lastEnd.getTime()) return "앞 회차와 시간이 겹칩니다.";
  return null;
}
