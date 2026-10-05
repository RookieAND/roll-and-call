import type { BadgeFacts } from "./badge-facts";
import { kstShifted } from "./kst-shifted";
import type { BadgeEvent } from "./reached-tier";
import { sessionEvents } from "./session-events";

const DAWN_HOUR = 6;

// 종료 시각이 시작한 날 다음 날 KST 06:00 이후인 인정 세션. GM·PL은 가리지 않는다.
export function allNightEvents(facts: BadgeFacts): BadgeEvent[] {
  return sessionEvents(
    [...facts.played, ...facts.hosted].filter((session) => {
      const start = kstShifted(session.startsAt);
      const dawn = Date.UTC(
        start.getUTCFullYear(),
        start.getUTCMonth(),
        start.getUTCDate() + 1,
        DAWN_HOUR,
      );
      return kstShifted(session.endsAt).getTime() >= dawn;
    }),
  );
}
