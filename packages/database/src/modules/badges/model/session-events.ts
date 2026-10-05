import type { BadgeSession } from "./badge-facts";
import type { BadgeEvent } from "./reached-tier";

// 세션 종료 시각 순으로 늘어놓은 사건. 숨겨진 칭호는 한 단계라 첫 사건이 획득 시각·근거다.
export function sessionEvents(sessions: BadgeSession[]): BadgeEvent[] {
  return sessions
    .toSorted((left, right) => left.endsAt.getTime() - right.endsAt.getTime())
    .map((session) => ({ at: session.endsAt, gameId: session.gameId }));
}
