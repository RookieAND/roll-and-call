import { rankPeople } from "./rank-people";
import type { CalendarSession } from "./to-calendar-sessions";

export type MonthRecord = ReturnType<typeof buildMonthRecord>;

// 끝난 세션만 센다. 아직 오지 않은 세션까지 세면 "몇 번 했는지"가 아니라 "몇 번 잡았는지"가 된다.
export function buildMonthRecord(sessions: CalendarSession[]) {
  const finished = sessions.filter((session) => session.finished);

  return {
    sessionCount: finished.length,
    gms: rankPeople(finished.map((session) => session.gm)),
    players: rankPeople(finished.flatMap((session) => session.players)),
  };
}
