import { isNil } from "es-toolkit";

import { addDays, toKstDateInput } from "@/shared/lib";

// 다음 회차에서 고를 수 있는 첫날(KST, YYYY-MM-DD). 1회차 세션 다음 날, 세션 시각이 없으면 조율 종료일 다음 날이다.
// 그날이 오늘보다 앞이면 내일로 올린다.
export function nextRoundBaseDate({
  confirmedAt,
  rangeEnd,
  now = new Date(),
}: {
  confirmedAt: Date | string | null;
  rangeEnd: string | null;
  now?: Date;
}): string {
  const today = toKstDateInput(now);
  const tomorrow = addDays({ date: today, count: 1 });
  const lastDay = isNil(confirmedAt) ? rangeEnd : toKstDateInput(confirmedAt);
  if (isNil(lastDay)) return tomorrow;
  const base = addDays({ date: lastDay, count: 1 });
  return base < today ? tomorrow : base;
}
