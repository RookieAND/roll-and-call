import { dayjs, KST } from "@roll-and-call/app-kit/date";

export function fromKstDateTimeInput(value: string): Date {
  return dayjs.tz(value, KST).toDate();
}
