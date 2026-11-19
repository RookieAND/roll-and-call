import { formatDateWeekday, toKst } from "@roll-and-call/app-kit/date";

import { clockTextLabel } from "#db/modules/games/model/clock-text-label";

// 「10월 31일 (토) 오후 12:00~4:00」. 끝이 시작과 같은 오전·오후면 끝의 오전·오후를 줄인다.
export function roundSpanText({ startsAt, endsAt }: { startsAt: string; endsAt: string }) {
  const start = clockTextLabel(toKst(startsAt).format("HH:mm"));
  const end = clockTextLabel(toKst(endsAt).format("HH:mm"));
  const endLabel = start.slice(0, 2) === end.slice(0, 2) ? end.slice(3) : end;
  return `${formatDateWeekday(startsAt)} ${start}~${endLabel}`;
}
