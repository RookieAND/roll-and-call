import { toKst } from "@/shared/lib";

const MINUTE_MS = 60_000;

// 끝 시각이 시작과 다른 날이면 「HH:mm(+1)」로 날짜 바뀜을 보인다. 날짜를 이미 고른 자리에서는 withDate를 끈다.
export function sessionWindowLabel({
  iso,
  playMinutes,
  withDate = true,
}: {
  iso: string;
  playMinutes: number;
  withDate?: boolean;
}) {
  const start = toKst(iso);
  const end = toKst(new Date(start.valueOf() + playMinutes * MINUTE_MS));
  const nextDay = end.format("YYYY-MM-DD") !== start.format("YYYY-MM-DD") ? "(+1)" : "";
  const startFormat = withDate ? "M/D (dd) HH:mm" : "HH:mm";
  return `${start.format(startFormat)} – ${end.format("HH:mm")}${nextDay}`;
}
