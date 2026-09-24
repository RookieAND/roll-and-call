const seoulDate = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" });

// Calendar가 쓰는 "YYYY-MM-DD" 키. 날짜 경계는 서울 기준이다.
export function toSeoulDateKey(date: Date) {
  return seoulDate.format(date);
}
