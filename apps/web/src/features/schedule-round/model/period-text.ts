import { toKst } from "@/shared/lib";

const DATE_FORMAT = "M월 D일";

// 「10월 24일 ~ 10월 30일」
export function periodText({ start, end }: { start: string; end: string }) {
  return `${toKst(`${start}T12:00:00+09:00`).format(DATE_FORMAT)} ~ ${toKst(`${end}T12:00:00+09:00`).format(DATE_FORMAT)}`;
}
