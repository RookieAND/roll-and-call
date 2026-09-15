export type RecordPerson = { id: string; username: string; avatarUrl: string | null };
export type RecordRow = { rank: number; person: RecordPerson; count: number };

const PODIUM_SIZE = 3;

// 동점은 같은 순위, 다음 순위는 건너뛴다(1, 2, 2). 세 자리를 못 채우면 null로 빈 줄을 남긴다.
export function rankPeople(appearances: RecordPerson[]): (RecordRow | null)[] {
  const counts = new Map<string, RecordRow>();
  for (const person of appearances) {
    const row = counts.get(person.id) ?? { rank: 0, person, count: 0 };
    row.count += 1;
    counts.set(person.id, row);
  }
  const sorted = [...counts.values()].toSorted((left, right) => right.count - left.count);
  const ranked = sorted.map((row) => ({
    ...row,
    rank: sorted.findIndex((other) => other.count === row.count) + 1,
  }));
  return Array.from({ length: PODIUM_SIZE }, (_, index) => ranked[index] ?? null);
}
