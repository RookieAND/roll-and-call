import { crossesMidnight, type CoordinationWindow } from "@/entities/game";
import { addDays, toKst } from "@/shared/lib";

export const DAY_MINUTES = 24 * 60;

// date는 격자의 열 날짜, minutes는 그 날 0시부터의 분이다. 자정 뒤 줄은 1440 이상이다.
export type SessionStart = { date: string; minutes: number };

export function toSessionStart({
  iso,
  window,
}: {
  iso: string;
  window: CoordinationWindow;
}): SessionStart {
  const kst = toKst(iso);
  const date = kst.format("YYYY-MM-DD");
  const minutes = kst.hour() * 60 + (kst.minute() < 30 ? 0 : 30);
  if (crossesMidnight(window) && kst.hour() < window.endHour) {
    return { date: addDays({ date, count: -1 }), minutes: minutes + DAY_MINUTES };
  }
  return { date, minutes };
}
