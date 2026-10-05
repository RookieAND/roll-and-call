import type { BadgeFacts } from "./badge-facts";
import type { BadgeEvent } from "./reached-tier";
import { sessionEvents } from "./session-events";

const LIGHTNING_WINDOW_MS = 24 * 60 * 60 * 1000;
const LIGHTNING_MIN_ATTENDED = 3;

// 구인을 올리고 24시간 안에 시작했고 확정 참석자가 3명 이상인 인정 세션. GM·PL은 가리지 않는다.
export function lightningEvents(facts: BadgeFacts): BadgeEvent[] {
  return sessionEvents(
    [...facts.played, ...facts.hosted].filter((session) => {
      const lead = session.startsAt.getTime() - session.registeredAt.getTime();
      return (
        lead >= 0 && lead <= LIGHTNING_WINDOW_MS && session.attendedCount >= LIGHTNING_MIN_ATTENDED
      );
    }),
  );
}
