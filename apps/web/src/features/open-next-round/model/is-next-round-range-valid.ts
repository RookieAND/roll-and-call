import { addDays } from "@/shared/lib";

import { NEXT_ROUND_MAX_DAYS } from "./next-round-rules";

// 날짜는 모두 KST YYYY-MM-DD라 글자 비교가 곧 날짜 비교다.
export function isNextRoundRangeValid({
  baseDate,
  rangeStart,
  rangeEnd,
}: {
  baseDate: string;
  rangeStart: string;
  rangeEnd: string;
}): boolean {
  const lastAllowed = addDays({ date: rangeStart, count: NEXT_ROUND_MAX_DAYS - 1 });
  return rangeStart >= baseDate && rangeEnd >= rangeStart && rangeEnd <= lastAllowed;
}
