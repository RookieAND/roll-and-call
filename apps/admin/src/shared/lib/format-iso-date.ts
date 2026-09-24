const isoDate = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Seoul",
});

// "2026-09-16"
export function formatIsoDate(date: Date) {
  return isoDate.format(date);
}
