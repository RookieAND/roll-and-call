import { formatDate } from "@/shared/lib";

import { toSeoulDateKey } from "./to-seoul-date-key";

const weekday = new Intl.DateTimeFormat("ko-KR", { weekday: "short", timeZone: "Asia/Seoul" });
const DAY = 86_400_000;

// "2026년 10월 2일 (금)"과 "10일 남음". 날짜 경계는 서울 기준이다.
export function formatEnforcementDate(date: Date, now: Date = new Date()) {
  const daysLeft = (Date.parse(toSeoulDateKey(date)) - Date.parse(toSeoulDateKey(now))) / DAY;
  const remaining = daysLeft > 0 ? `${daysLeft}일 남음` : daysLeft === 0 ? "오늘 적용" : "적용 중";
  return { label: `${formatDate(date)} (${weekday.format(date)})`, remaining };
}
