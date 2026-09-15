import { dayjs } from "@/shared/lib";

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;

export function formatPickerDate(value: string) {
  if (!DATE_KEY.test(value)) return value;
  return dayjs.utc(value).format("M월 D일 (dd)");
}
