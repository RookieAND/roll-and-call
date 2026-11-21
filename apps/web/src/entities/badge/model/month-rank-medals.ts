import { BADGE_ROLE } from "@roll-and-call/database/badges/model";

import type { MonthRecord } from "./build-month-record";
import type { RecordRanking } from "./rank-people";

export type MonthRankMedal = {
  role: typeof BADGE_ROLE.gm | typeof BADGE_ROLE.player;
  rank: 1 | 2 | 3;
};

function addMedals(
  medals: Map<string, MonthRankMedal[]>,
  role: MonthRankMedal["role"],
  ranking: RecordRanking,
) {
  const add = (userId: string, rank: 1 | 2 | 3) =>
    medals.set(userId, [...(medals.get(userId) ?? []), { role, rank }]);
  ranking.leaders.forEach((person) => add(person.id, 1));
  ranking.runnersUp.forEach((row) => {
    if (row && (row.rank === 2 || row.rank === 3)) add(row.person.id, row.rank);
  });
}

// 이달의 기록 1~3위 메달. 사람마다 운영(gm) 다음 참여(player) 순이다.
export function monthRankMedals(record: MonthRecord) {
  const medals = new Map<string, MonthRankMedal[]>();
  addMedals(medals, BADGE_ROLE.gm, record.gms);
  addMedals(medals, BADGE_ROLE.player, record.players);
  return medals;
}
