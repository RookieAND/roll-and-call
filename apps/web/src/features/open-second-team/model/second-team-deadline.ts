import { isUndefined } from "es-toolkit";

import { dayjs, KST } from "@/shared/lib";

import { SECOND_TEAM_DEADLINE_LEAD_MINUTES } from "./second-team-rules";

// 일시 지정형은 세션 일시, 조율형은 조율 시작일 0시(KST)에서 앞당긴 시각.
export function secondTeamDeadline({
  startsAt,
  rangeStart,
}: {
  startsAt?: Date;
  rangeStart?: string;
}): Date {
  const anchor = isUndefined(startsAt) ? dayjs.tz(rangeStart, KST) : dayjs(startsAt);
  return anchor.subtract(SECOND_TEAM_DEADLINE_LEAD_MINUTES, "minute").toDate();
}
