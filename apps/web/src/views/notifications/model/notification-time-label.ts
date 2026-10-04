import { toKst } from "@/shared/lib";

const MINUTE_MS = 60_000;
const HOUR_MINUTES = 60;

// 한 시간 안이면 「N분 전」, 그 밖은 KST 「HH:mm」. 날짜는 묶음 머리가 알려 준다.
export function notificationTimeLabel(createdAt: Date, now: Date) {
  const minutes = Math.floor((now.getTime() - createdAt.getTime()) / MINUTE_MS);
  if (minutes < HOUR_MINUTES) return `${Math.max(minutes, 1)}분 전`;
  return toKst(createdAt).format("HH:mm");
}
