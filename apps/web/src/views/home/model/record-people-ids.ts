import type { MonthRecord } from "./build-month-record";
import type { RecordRanking } from "./rank-people";

function rankingIds(ranking: RecordRanking) {
  return [
    ...ranking.leaders.map((person) => person.id),
    ...ranking.runnersUp.flatMap((row) => (row ? [row.person.id] : [])),
  ];
}

export function recordPeopleIds(record: MonthRecord) {
  return [...rankingIds(record.gms), ...rankingIds(record.players)];
}
