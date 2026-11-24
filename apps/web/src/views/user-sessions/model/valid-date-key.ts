import { DATE_KEY_FORMAT, dayjs, KST } from "@/shared/lib";

// 2026-02-30처럼 달력에 없는 날은 되돌아 쓰면 달라지므로 걸러 낸다.
export function validDateKey(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return dayjs.tz(value, KST).format(DATE_KEY_FORMAT) === value ? value : undefined;
}
