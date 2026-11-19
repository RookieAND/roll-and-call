import { toKst } from "@/shared/lib";

import { roundClockLabel } from "./round-clock-label";

// 「오후 12:00~4:00」. 끝이 시작과 같은 오전·오후면 끝의 오전·오후는 줄인다.
export function roundTimeRange({
  startsAt,
  endsAt,
}: {
  startsAt: Date | string;
  endsAt: Date | string;
}) {
  const isSameMeridiem = toKst(startsAt).hour() < 12 === toKst(endsAt).hour() < 12;
  const endLabel = isSameMeridiem ? toKst(endsAt).format("h:mm") : roundClockLabel(endsAt);
  return `${roundClockLabel(startsAt)}~${endLabel}`;
}
