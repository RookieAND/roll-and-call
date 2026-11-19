import { isNil } from "es-toolkit";

import { roundEndAt } from "./round-end-at";
import { ROUND_MAX_HOURS } from "./round-limits";

const HOUR_MS = 3_600_000;

type Moment = Date | string | null;

// 회차 일시를 정하거나 옮길 때의 입력 오류. 앞·뒤 회차는 새 순서 기준으로 넘긴다.
export function roundTimeError({
  previousRound,
  nextRound,
  startsAt,
  endsAt,
  now,
}: {
  previousRound: { plannedEndAt: Moment; endedAt: Moment } | undefined;
  nextRound: { startAt: Moment } | undefined;
  startsAt: Date;
  endsAt: Date;
  now: Date;
}): string | null {
  if (endsAt.getTime() <= startsAt.getTime()) return "종료 시각은 시작 시각보다 뒤여야 합니다.";
  if (endsAt.getTime() - startsAt.getTime() > ROUND_MAX_HOURS * HOUR_MS) {
    return "한 회차는 24시간을 넘을 수 없습니다.";
  }
  if (startsAt.getTime() <= now.getTime()) return "지난 시각으로는 정할 수 없습니다.";
  const previousEnd = previousRound ? roundEndAt(previousRound) : null;
  if (previousEnd && startsAt.getTime() < previousEnd.getTime())
    return "앞 회차와 시간이 겹칩니다.";
  if (
    nextRound &&
    !isNil(nextRound.startAt) &&
    endsAt.getTime() > new Date(nextRound.startAt).getTime()
  ) {
    return "뒤 회차와 시간이 겹칩니다.";
  }
  return null;
}
