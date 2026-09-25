import { formatDateTime } from "./format-date-time";

// "9월 22일 14:36". 최근 기록을 쌓는 목록처럼 연도가 자명한 자리에 쓴다.
export function formatShortDateTime(date: Date) {
  return formatDateTime(date).replace(/^\d+년 /, "");
}
