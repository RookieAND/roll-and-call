export const WEEKDAY_TONE: Record<number, string> = {
  0: "text-sunday",
  6: "text-saturday",
};

// 선택·오늘이 가장 먼저고, 지난 날은 흐리게, 나머지는 요일 색이다.
export function calendarDayTone({
  selected,
  today,
  past,
  weekday,
}: {
  selected: boolean;
  today: boolean;
  past: boolean;
  weekday: number;
}): string {
  if (selected) return "text-on-primary";
  if (today) return "text-tinted-ink";
  if (past) return "text-disabled";
  return WEEKDAY_TONE[weekday] ?? "text-gray-900";
}
