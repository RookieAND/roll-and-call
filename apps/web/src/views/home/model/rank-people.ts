import type { ScoreboardRow } from "@roll-and-call/database/badges/model";
import { range } from "es-toolkit";

export type RecordPerson = { id: string; username: string; avatarUrl: string | null };
export type RecordRow = {
  rank: number;
  person: RecordPerson;
  score: number;
  sessionCount: number;
};
export type RecordRanking = {
  leaders: RecordRow[];
  runnersUp: (RecordRow | null)[];
};

const RUNNER_UP_SIZE = 2;

// 점수판(monthScoreboard)을 홈 모양으로 옮긴다. 1위는 동점자를 한 장으로 묶고, 아래 두 줄은 다음 점수대부터 2·3위로 잇는다. 못 채운 자리는 null로 남긴다.
export function rankPeople(
  board: ScoreboardRow[],
  people: ReadonlyMap<string, RecordPerson>,
): RecordRanking {
  const ranked = board.flatMap((row) => {
    const person = people.get(row.userId);
    return person
      ? [{ rank: row.rank, person, score: row.score, sessionCount: row.sessionCount }]
      : [];
  });
  const leaders = ranked.filter((row) => row.rank === 1);
  const runnersUp = ranked.filter((row) => row.rank !== 1);

  return {
    leaders,
    runnersUp: range(RUNNER_UP_SIZE).map((index) => runnersUp[index] ?? null),
  };
}
