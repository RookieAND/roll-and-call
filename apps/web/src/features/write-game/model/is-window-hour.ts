// 조율 시간대 칸 값은 "0"~"23" 정수 문자열이다.
export function isWindowHour(value: string): boolean {
  const hour = Number(value);
  return value.trim() !== "" && Number.isInteger(hour) && hour >= 0 && hour <= 23;
}
