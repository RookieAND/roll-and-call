import { ddayKst, formatDate } from "@/shared/lib";

export function notificationDayLabel(createdAt: Date, now: Date) {
  const day = ddayKst(createdAt, now);
  if (day === 0) return "오늘";
  if (day === -1) return "어제";
  return formatDate(createdAt);
}
