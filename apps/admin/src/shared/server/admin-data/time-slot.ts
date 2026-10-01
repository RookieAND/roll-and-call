// time-grid의 TIME_SLOTS 순서. 새벽(0~6시)은 맨 뒤다.
export function timeSlot(hour: number) {
  if (hour < 6) return 6;
  if (hour < 12) return 0;
  if (hour < 15) return 1;
  if (hour < 18) return 2;
  if (hour < 20) return 3;
  if (hour < 22) return 4;
  return 5;
}
