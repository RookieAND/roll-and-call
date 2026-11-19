import { isStartInCoordinationRange } from "@roll-and-call/database/games/model";

import { toKst } from "@/shared/lib";

// 칸이 조율 기간(KST 날짜)과 하루 시간대 안인지. 자정을 넘는 시간대면 끝 시각 전까지가 안이다.
export function isSlotInRoundCoordination({
  slot,
  start,
  end,
  windowStartHour,
  windowEndHour,
}: {
  slot: Date;
  start: string;
  end: string;
  windowStartHour: number;
  windowEndHour: number;
}): boolean {
  const window = { startHour: windowStartHour, endHour: windowEndHour };
  if (!isStartInCoordinationRange({ startsAt: slot, rangeStart: start, rangeEnd: end, window })) {
    return false;
  }
  const hour = toKst(slot).hour();
  return windowEndHour <= windowStartHour
    ? hour >= windowStartHour || hour < windowEndHour
    : hour >= windowStartHour && hour < windowEndHour;
}
