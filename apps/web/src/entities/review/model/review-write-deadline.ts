import { dayjs } from "@/shared/lib";

import { REVIEW_WRITE_DAYS } from "./review-rules";

export function reviewWriteDeadline(attendanceConfirmedAt: Date | string): Date {
  return dayjs(attendanceConfirmedAt).add(REVIEW_WRITE_DAYS, "day").toDate();
}
