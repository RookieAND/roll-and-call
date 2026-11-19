import { isNil } from "es-toolkit";

type Moment = Date | string | null;

// 회차의 실제 종료: GM이 마친 시각, 없으면 예정 종료. 일시가 없는 회차는 null이다.
export function roundEndAt({
  plannedEndAt,
  endedAt,
}: {
  plannedEndAt: Moment;
  endedAt: Moment;
}): Date | null {
  if (!isNil(endedAt)) return new Date(endedAt);
  return isNil(plannedEndAt) ? null : new Date(plannedEndAt);
}
