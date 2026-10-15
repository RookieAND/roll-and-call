import { isAbsenceActive } from "@roll-and-call/database/games/model";

import { NO_SHOW_STATUS } from "./no-show-status";

interface NoShowStatusOfOptions {
  cancelled: boolean;
  startsAt: Date;
  now: number;
}

// 세션 시작 30일이 지난 유효 기록은 「기간 지남」이다(불참 횟수에 세지 않는다).
export function noShowStatusOf({ cancelled, startsAt, now }: NoShowStatusOfOptions) {
  if (cancelled) return NO_SHOW_STATUS.cancelled;
  if (!isAbsenceActive({ sessionStartsAt: startsAt, now })) return NO_SHOW_STATUS.expired;
  return NO_SHOW_STATUS.valid;
}
