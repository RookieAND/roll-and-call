const seoulDate = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" });

export function toSeoulDateKey(date: Date) {
  return seoulDate.format(date);
}
