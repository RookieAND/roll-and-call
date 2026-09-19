import { rankPeople } from "./rank-people";
import type { CalendarSession } from "./to-calendar-sessions";

export type MonthRecord = ReturnType<typeof buildMonthRecord>;

// 끝난 세션만 센다. 연 글 수로 세면 올리고 무산시켜도 순위가 오른다.
export function buildMonthRecord(sessions: CalendarSession[]) {
  const finished = sessions.filter((session) => session.finished);
  return {
    sessionCount: finished.length,
    gms: rankPeople(finished.map((session) => session.gm)),
    players: rankPeople(finished.flatMap((session) => session.players)),
  };
}
