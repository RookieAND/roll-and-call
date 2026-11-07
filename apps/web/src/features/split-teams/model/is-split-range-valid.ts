import { addDays } from "@/shared/lib";

import { SPLIT_TEAMS_RANGE_MAX_DAYS } from "./split-teams-rules";

// 날짜는 모두 KST YYYY-MM-DD라 글자 비교가 곧 날짜 비교다.
export function isSplitRangeValid({
  today,
  rangeStart,
  rangeEnd,
}: {
  today: string;
  rangeStart: string;
  rangeEnd: string;
}): boolean {
  const lastAllowed = addDays({ date: rangeStart, count: SPLIT_TEAMS_RANGE_MAX_DAYS - 1 });
  return rangeStart >= today && rangeEnd >= rangeStart && rangeEnd <= lastAllowed;
}
