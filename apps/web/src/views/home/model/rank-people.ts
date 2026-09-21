import { groupBy, uniq } from "es-toolkit";

export type RecordPerson = { id: string; username: string; avatarUrl: string | null };
export type RecordRow = { rank: number; person: RecordPerson; count: number };
export type RecordRanking = {
  leaders: RecordPerson[];
  leaderCount: number;
  runnersUp: (RecordRow | null)[];
};

const RUNNER_UP_SIZE = 2;

// 1위는 동점자를 한 장으로 묶고, 아래 두 줄은 다음 점수대부터 2·3위로 잇는다. 못 채운 자리는 null로 남긴다.
export function rankPeople(appearances: RecordPerson[]): RecordRanking {
  const sorted = Object.values(groupBy(appearances, (person) => person.id))
    .map((group) => ({ person: group[0]!, count: group.length }))
    .toSorted((left, right) => right.count - left.count);
  const scores = uniq(sorted.map((row) => row.count));
  const ranked = sorted.map((row) => ({ ...row, rank: scores.indexOf(row.count) + 1 }));
  const leaders = ranked.filter((row) => row.rank === 1);
  const runnersUp = ranked.filter((row) => row.rank !== 1);

  return {
    leaders: leaders.map((row) => row.person),
    leaderCount: leaders[0]?.count ?? 0,
    runnersUp: Array.from({ length: RUNNER_UP_SIZE }, (_, index) => runnersUp[index] ?? null),
  };
}
