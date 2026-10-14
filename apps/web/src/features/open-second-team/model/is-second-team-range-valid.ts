import { addDays } from "@/shared/lib";

import { SECOND_TEAM_MAX_DAYS } from "./second-team-rules";

// 날짜는 모두 KST YYYY-MM-DD라 글자 비교가 곧 날짜 비교다.
export function isSecondTeamRangeValid({
  baseDate,
  rangeStart,
  rangeEnd,
}: {
  baseDate: string;
  rangeStart: string;
  rangeEnd: string;
}): boolean {
  const lastAllowed = addDays({ date: rangeStart, count: SECOND_TEAM_MAX_DAYS - 1 });
  return rangeStart >= baseDate && rangeEnd >= rangeStart && rangeEnd <= lastAllowed;
}
