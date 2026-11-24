import { DATE_KEY_FORMAT, dayjs, KST, toKst } from "@/shared/lib";

export function resolveCalendarView(date: string | undefined, now: Date = new Date()) {
  const todayKey = toKst(now).format(DATE_KEY_FORMAT);
  const isValidDate = Boolean(date) && dayjs.tz(date, KST).format(DATE_KEY_FORMAT) === date;
  const selectedKey = isValidDate ? date! : todayKey;

  return {
    selected: dayjs.tz(selectedKey, KST),
    monthStart: dayjs.tz(`${selectedKey.slice(0, 7)}-01`, KST),
    selectedKey,
    todayKey,
  };
}
