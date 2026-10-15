import { timeSlot } from "./time-slot";

const SEOUL_OFFSET = 9 * 3_600_000;

// 요일(월=0) × 시간대. 서울 시각으로 가른다.
export function gridCell(date: Date) {
  const seoul = new Date(date.getTime() + SEOUL_OFFSET);
  const day = (seoul.getUTCDay() + 6) % 7;
  return { day, slot: timeSlot(seoul.getUTCHours()) };
}
