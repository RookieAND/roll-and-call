import { formatDate } from "@/shared/lib";

import type { ScheduleLine } from "./schedule-line";

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
