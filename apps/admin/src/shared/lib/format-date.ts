const fullDate = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "Asia/Seoul",
});

// "2026년 9월 16일"
export function formatDate(date: Date) {
  return fullDate.format(date);
}
