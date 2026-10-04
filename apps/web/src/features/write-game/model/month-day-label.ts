import { dayjs } from "@/shared/lib";

// 폼 값("YYYY-MM-DD" 또는 "YYYY-MM-DDTHH:mm", KST)의 날짜를 「M월 D일」로.
export function monthDayLabel(value: string): string {
  return dayjs(value.slice(0, 10)).format("M월 D일");
}
