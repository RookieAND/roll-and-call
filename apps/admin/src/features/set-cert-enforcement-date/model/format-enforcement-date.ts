import { formatDate } from "@/shared/lib";

import { remainingLabel } from "./remaining-label";
import { toSeoulDateKey } from "./to-seoul-date-key";

const weekday = new Intl.DateTimeFormat("ko-KR", { weekday: "short", timeZone: "Asia/Seoul" });
const DAY = 86_400_000;

// 날짜 경계는 서울 기준이다.
export function formatEnforcementDate(date: Date, now: Date = new Date()) {
  const daysLeft = (Date.parse(toSeoulDateKey(date)) - Date.parse(toSeoulDateKey(now))) / DAY;
  return {
    label: `${formatDate(date)} (${weekday.format(date)})`,
    remaining: remainingLabel(daysLeft),
  };
}
