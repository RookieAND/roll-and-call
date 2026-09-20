import { dayjs } from "@/shared/lib";

export const ABSENCE_RECORD_MONTHS = 3;

// 불참 기록은 세션 날짜로부터 3개월 뒤에 사라진다.
export function absenceExpiresAt(sessionAt: Date | string): Date {
  return dayjs(sessionAt).add(ABSENCE_RECORD_MONTHS, "month").toDate();
}
