import { describe, expect, it } from "vitest";

import { rankPeople } from "./rank-people";

const person = (id: string) => ({ id, username: id, avatarUrl: null });
const people = (...ids: string[]) => ids.map(person);

describe("rankPeople", () => {
  it("가장 많이 나온 사람이 1위, 그다음 점수대가 2위다", () => {
    const podium = rankPeople(people("a", "b", "a", "c", "a", "c", "b", "d"));
    expect(podium.leaders.map((leader) => leader.id)).toEqual(["a"]);
    expect(podium.leaderCount).toBe(3);
    expect(podium.runnersUp.map((row) => row && [row.person.id, row.rank, row.count])).toEqual([
      ["b", 2, 2],
      ["c", 2, 2],
    ]);
  });

  it("모두 같은 횟수면 전원이 공동 1위다", () => {
    const tied = rankPeople(people("a", "b", "c"));
    expect(tied.leaders.map((leader) => leader.id)).toEqual(["a", "b", "c"]);
    expect(tied.leaderCount).toBe(1);
    expect(tied.runnersUp).toEqual([null, null]);
  });

  it("자리가 모자라면 빈 칸으로 둔다", () => {
    const sparse = rankPeople(people("a", "a", "b"));
    expect(sparse.leaders.map((leader) => leader.id)).toEqual(["a"]);
    expect(sparse.runnersUp.map((row) => row && [row.person.id, row.rank])).toEqual([
      ["b", 2],
      null,
    ]);
  });

  it("아무도 없으면 빈 시상대다", () => {
    const empty = rankPeople([]);
    expect(empty.leaders).toEqual([]);
    expect(empty.runnersUp).toEqual([null, null]);
  });
});
