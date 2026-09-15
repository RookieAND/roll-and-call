import { dayjs, KST } from "./dayjs";

export function fromKstDateTimeInput(value: string): Date {
  return dayjs.tz(value, KST).toDate();
}
