import { dayjs } from "@/shared/lib";

import { REVIEW_EDIT_DAYS } from "./review-rules";

export function reviewEditDeadline(createdAt: Date | string): Date {
  return dayjs(createdAt).add(REVIEW_EDIT_DAYS, "day").toDate();
}
