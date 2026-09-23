import { formatDate } from "@/shared/lib";

import type { ScheduleLine } from "./schedule-line";

// 지난 구인 카드의 일정 줄: 끝난 세션은 끝난 날, 일정 없이 마감된 글은 마감한 날을 말한다.
export function pastScheduleLine({
  line,
  endsAt,
  endDate,
}: {
  line: ScheduleLine;
  endsAt: Date | null;
  endDate: Date;
}): ScheduleLine {
  if (endsAt) return { ...line, text: `${formatDate(endsAt)} 세션 종료`, finished: true };
  return { ...line, text: `${formatDate(endDate)}에 모집 마감`, finished: true };
}
