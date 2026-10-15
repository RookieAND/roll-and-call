import { formatDate } from "@/shared/lib";

// 모바일 줄은 폭이 좁아 연도를 뺀다.
export function withoutYear(date: Date) {
  return formatDate(date).replace(/^\d{4}년 /, "");
}
