import type { BadgeFacts } from "./badge-facts";
import { kstShifted } from "./kst-shifted";
import type { BadgeEvent } from "./reached-tier";
import { sessionEvents } from "./session-events";

const OWL_LAST_HOUR = 4;

// 시작 시각이 KST 00:00~04:59인 인정 세션. GM·PL은 가리지 않는다.
export function owlEvents(facts: BadgeFacts): BadgeEvent[] {
  return sessionEvents(
    [...facts.played, ...facts.hosted].filter(
      (session) => kstShifted(session.startsAt).getUTCHours() <= OWL_LAST_HOUR,
    ),
  );
}
