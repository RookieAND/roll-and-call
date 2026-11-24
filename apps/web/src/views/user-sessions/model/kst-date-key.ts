import { DATE_KEY_FORMAT, toKst } from "@/shared/lib";

export function kstDateKey(value: Date | string): string {
  return toKst(value).format(DATE_KEY_FORMAT);
}
