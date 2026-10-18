import { formatFullDateTime } from "@/shared/lib";

// 모바일 줄 오른쪽 시각: 올해는 연도를 빼고, 오늘은 「오늘 11:02」다.
export function logRowTime(date: Date, now: Date = new Date()) {
  const [year, month, day, time] = formatFullDateTime(date).split(" ");
  const today = formatFullDateTime(now).split(" ");
  if (year === today[0] && month === today[1] && day === today[2]) return `오늘 ${time}`;
  if (year === today[0]) return `${month} ${day} ${time}`;
  return `${year} ${month} ${day} ${time}`;
}
