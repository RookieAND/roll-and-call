const parts = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "Asia/Seoul",
});

// "2026년 9월 22일 14:36"
export function formatDateTime(date: Date) {
  const value = Object.fromEntries(
    parts.formatToParts(date).map((part) => [part.type, part.value]),
  );
  return `${value.year}년 ${value.month}월 ${value.day}일 ${value.hour}:${value.minute}`;
}
