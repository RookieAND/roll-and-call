import { isNull } from "es-toolkit";

import { toKstDateInput } from "@/shared/lib";

// 다회차 회차의 가능 시간을 낼 수 없는 이유. 낼 수 있으면 null.
export function roundAvailabilityBlockReason({
  coordination,
  now,
  isMember,
}: {
  coordination: { status: string; start: string | null; end: string | null } | null;
  now: Date;
  isMember: boolean;
}): string | null {
  if (!isMember) return "참여자만 가능 시간을 등록할 수 있습니다.";
  if (!coordination || coordination.status !== "coordinating" || isNull(coordination.start)) {
    return "가능 시간을 모으는 회차가 아닙니다.";
  }
  const today = toKstDateInput(now);
  if (today < coordination.start || (coordination.end !== null && today > coordination.end)) {
    return "가능 시간을 받는 기간이 아닙니다.";
  }
  return null;
}
