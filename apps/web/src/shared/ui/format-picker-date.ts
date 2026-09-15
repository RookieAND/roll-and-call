const weekdayFormat = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  weekday: "short",
});

export function formatPickerDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  // KST 정오로 만들어 어느 타임존에서 포맷해도 요일이 밀리지 않게 한다.
  const date = new Date(Date.UTC(year, month - 1, day, 3));
  return `${month}월 ${day}일 (${weekdayFormat.format(date)})`;
}
