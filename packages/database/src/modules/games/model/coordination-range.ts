import { type CoordinationWindow, crossesMidnight } from "./coordination-window";

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

// 세션 시작의 KST 날짜가 조율 기간 안인지. 자정을 넘는 시간대면 마지막 열의 자정 뒤 줄(다음 날 끝 시각 전)도 안이다.
// 시각이 시간대 밖인지는 보지 않는다(허용, C09).
export function isStartInCoordinationRange({
  startsAt,
  rangeStart,
  rangeEnd,
  window,
}: {
  startsAt: Date;
  rangeStart: string;
  rangeEnd: string;
  window: CoordinationWindow;
}): boolean {
  const kst = new Date(startsAt.getTime() + KST_OFFSET_MS);
  const date = kst.toISOString().slice(0, 10);
  if (rangeStart <= date && date <= rangeEnd) return true;
  const dayAfterEnd = new Date(Date.parse(`${rangeEnd}T00:00:00Z`) + DAY_MS)
    .toISOString()
    .slice(0, 10);
  return crossesMidnight(window) && date === dayAfterEnd && kst.getUTCHours() < window.endHour;
}
