import { isUndefined } from "es-toolkit";

import { dayjs, KST } from "@/shared/lib";

import { NEXT_ROUND_DEADLINE_LEAD_MINUTES } from "./next-round-rules";

// 일시 지정형은 세션 일시, 조율형은 조율 종료일 0시(KST)에서 앞당긴 시각.
export function nextRoundDeadline({
  startsAt,
  rangeEnd,
}: {
  startsAt?: Date;
  rangeEnd?: string;
}): Date {
  const anchor = isUndefined(startsAt) ? dayjs.tz(rangeEnd, KST) : dayjs(startsAt);
  return anchor.subtract(NEXT_ROUND_DEADLINE_LEAD_MINUTES, "minute").toDate();
}
