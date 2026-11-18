import { formatDateWeekday } from "@/shared/lib";

import { roundTimeRange } from "./round-time-range";

// 「10월 24일 (토) 오후 12:00~4:00」
export function roundSlotLabel({
  startsAt,
  endsAt,
}: {
  startsAt: Date | string;
  endsAt: Date | string;
}) {
  return `${formatDateWeekday(startsAt)} ${roundTimeRange({ startsAt, endsAt })}`;
}
