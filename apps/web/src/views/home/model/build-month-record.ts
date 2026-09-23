import { rankPeople } from "./rank-people";
import type { CalendarSession } from "./to-calendar-sessions";

export type MonthRecord = ReturnType<typeof buildMonthRecord>;

// 화면 문구("이 달에 끝난 세션 n건")대로 이미 끝난 세션만 센다. 무산된 세션은 달력에서 이미 빠져 있다.
export function buildMonthRecord(sessions: CalendarSession[]) {
  const finished = sessions.filter((session) => session.finished);
  return {
    sessionCount: finished.length,
    gms: rankPeople(finished.map((session) => session.gm)),
    players: rankPeople(finished.flatMap((session) => session.players)),
  };
}
