import { formatDate } from "@/shared/lib";

const weekday = new Intl.DateTimeFormat("ko-KR", { weekday: "short", timeZone: "Asia/Seoul" });

export function formatToday(date: Date) {
  return `${formatDate(date)} (${weekday.format(date)})`;
}
