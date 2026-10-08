import { formatDateTime, toKst } from "@/shared/lib";

const MINUTE_MS = 60_000;

// 확인 창의 값 상자용: 「9월 17일 (목) 20:30 – 23:30」. 끝 시각이 다른 날이면 「(+1)」을 붙인다.
export function sessionDialogLabel({ iso, playMinutes }: { iso: string; playMinutes: number }) {
  const start = toKst(iso);
  const end = toKst(new Date(start.valueOf() + playMinutes * MINUTE_MS));
  const nextDay = end.format("YYYY-MM-DD") !== start.format("YYYY-MM-DD") ? "(+1)" : "";
  return `${formatDateTime(iso)} – ${end.format("HH:mm")}${nextDay}`;
}
