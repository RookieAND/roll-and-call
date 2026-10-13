import type { BadgeFacts } from "./badge-facts";
import type { BadgeEvent } from "./reached-tier";

const FAITHFUL_ATTENDED = 10;

// PL로 참석한 인정 세션을 시간순으로 세어, 불참 기록이 한 번도 끼지 않고 FAITHFUL_ATTENDED번째에 닿은 세션.
// 불참이 끼면 처음부터 다시 센다. 사건은 그 세션의 종료 시각.
export function faithfulEvents(facts: BadgeFacts): BadgeEvent[] {
  const timeline = [
    ...facts.played.map((session) => ({ at: session.startsAt, session })),
    ...facts.absences.map((absence) => ({ at: absence.at, session: null })),
  ].toSorted((left, right) => left.at.getTime() - right.at.getTime());
  let run = 0;
  for (const { session } of timeline) {
    run = session ? run + 1 : 0;
    if (session && run === FAITHFUL_ATTENDED) {
      return [{ at: session.endsAt, gameId: session.gameId }];
    }
  }
  return [];
}
