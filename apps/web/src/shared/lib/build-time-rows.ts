import { windowHours } from "@roll-and-call/database/games/model";
import { range } from "es-toolkit";

import { padTwoDigits } from "./pad-two-digits";
import { SLOT_MINUTES } from "./slot-window";

const DAY_MINUTES = 24 * 60;

export type TimeRow = { hour: number; minute: number; label: string; dayOffset: 0 | 1 };

// 구인의 조율 시간대를 30분 줄로 편다. 자정을 지난 줄은 열 날짜의 다음 날이다(dayOffset 1).
export function buildTimeRows({
  startHour,
  endHour,
}: {
  startHour: number;
  endHour: number;
}): TimeRow[] {
  const rowCount = (windowHours({ startHour, endHour }) * 60) / SLOT_MINUTES;
  return range(rowCount).map((index) => {
    const minutes = startHour * 60 + index * SLOT_MINUTES;
    const hour = Math.floor(minutes / 60) % 24;
    const minute = minutes % 60;
    return {
      hour,
      minute,
      label: `${padTwoDigits(hour)}:${padTwoDigits(minute)}`,
      dayOffset: minutes >= DAY_MINUTES ? 1 : 0,
    };
  });
}
