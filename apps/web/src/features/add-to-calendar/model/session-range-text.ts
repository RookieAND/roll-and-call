import { formatDateTime, toKst } from "@/shared/lib";

// 「9월 16일 (수) 20:00 ~ 23:00」. 끝이 다음 날이면 끝에도 날짜를 붙인다.
export function sessionRangeText({ startsAt, endsAt }: { startsAt: Date; endsAt: Date }) {
  const sameDay = toKst(startsAt).isSame(toKst(endsAt), "day");
  const end = sameDay ? toKst(endsAt).format("HH:mm") : formatDateTime(endsAt);
  return `${formatDateTime(startsAt)} ~ ${end}`;
}
