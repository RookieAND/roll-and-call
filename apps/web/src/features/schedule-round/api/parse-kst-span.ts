import { fromKstDateTimeInput } from "@/shared/lib";

// 입력 칸(KST datetime-local) 두 값을 시각으로 바꾼다. 읽을 수 없으면 null.
export function parseKstSpan({
  startsAt,
  endsAt,
}: {
  startsAt: string;
  endsAt: string;
}): { startsAt: Date; endsAt: Date } | null {
  const start = fromKstDateTimeInput(startsAt);
  const end = fromKstDateTimeInput(endsAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  return { startsAt: start, endsAt: end };
}
