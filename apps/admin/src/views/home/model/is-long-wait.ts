const LONG_WAIT_DAYS = 3;

// 보라 강조는 가장 오래된 건이 3일 이상 기다린 행에만 둔다(D193).
export function isLongWait(oldestDays: number) {
  return oldestDays >= LONG_WAIT_DAYS;
}
