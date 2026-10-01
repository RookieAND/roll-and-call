import { dayjs } from "@/shared/lib";

export const ABSENCE_RECORD_MONTHS = 3;

export function absenceExpiresAt(sessionAt: Date | string): Date {
  return dayjs(sessionAt).add(ABSENCE_RECORD_MONTHS, "month").toDate();
}
