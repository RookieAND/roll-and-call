const monthDay = new Intl.DateTimeFormat("ko-KR", {
  month: "long",
  day: "numeric",
  timeZone: "Asia/Seoul",
});

export function formatMonthDay(date: Date) {
  return monthDay.format(date);
}
