import type { Dayjs } from "dayjs";

import { dayjs, KST, toKst } from "@/shared/lib";

const MONTH_KEY_FORMAT = "YYYY-MM";

function parseMonth(value: string | undefined): Dayjs | null {
  if (!value) return null;
  const parsed = dayjs.tz(`${value}-01`, KST);
  return parsed.isValid() && parsed.format(MONTH_KEY_FORMAT) === value ? parsed : null;
}

// 고른 날짜의 달이 먼저고, 없으면 month, 둘 다 없거나 잘못되면 이번 달이다.
export function resolveCalendarMonth({
  date,
  month,
  now,
}: {
  date?: string;
  month?: string;
  now: Date;
}): Dayjs {
  const fromDate = parseMonth(date?.slice(0, 7));
  return fromDate ?? parseMonth(month) ?? toKst(now).startOf("month");
}
