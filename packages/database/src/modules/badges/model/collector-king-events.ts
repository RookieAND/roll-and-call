import type { BadgeFacts } from "./badge-facts";
import type { BadgeEvent } from "./reached-tier";
import { sizeEvents } from "./size-events";
import { timeSlotEvents } from "./time-slot-events";
import { weekdayEvents } from "./weekday-events";

// 요일 수집가·시간 수집가·두루두루를 모두 받은 순간(가장 늦게 채운 칭호가 근거). 하나라도 못 받으면 사건이 없어 함께 회수된다.
export function collectorKingEvents(facts: BadgeFacts): BadgeEvent[] {
  const firsts = [weekdayEvents(facts), timeSlotEvents(facts), sizeEvents(facts)].map(
    (events) => events[0],
  );
  if (firsts.some((event) => !event)) return [];
  return [firsts.toSorted((left, right) => left!.at.getTime() - right!.at.getTime()).at(-1)!];
}
