import { describe, expect, it } from "vitest";

import { rankPeople } from "./rank-people";

const person = (id: string) => ({ id, username: id, avatarUrl: null });
const people = (...ids: string[]) =>
  ids.map((id) => ({ person: person(id), weight: 1, sessions: 1 }));

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

describe("rankPeople 미니룰", () => {
  it("미니룰 세션은 0.5회로 센다", () => {
    const podium = rankPeople([
      { person: person("a"), weight: 1, sessions: 1 },
      { person: person("b"), weight: 0.5, sessions: 1 },
      { person: person("b"), weight: 0.5, sessions: 1 },
      { person: person("b"), weight: 0.5, sessions: 1 },
    ]);
    expect(podium.leaders.map((leader) => leader.id)).toEqual(["b"]);
    expect(podium.leaderCount).toBe(1.5);
  });
});

describe("rankPeople 포인트제", () => {
  it("점수가 0 이하인 사람은 순위에서 빠지고 세션 횟수를 함께 돌려준다", () => {
    const ranking = rankPeople([
      { person: person("a"), weight: 100, sessions: 1 },
      { person: person("a"), weight: 10, sessions: 0 },
      { person: person("b"), weight: 50, sessions: 1 },
      { person: person("b"), weight: -100, sessions: 0 },
    ]);
    expect(ranking.leaders.map((target) => target.id)).toEqual(["a"]);
    expect(ranking.leaderCount).toBe(110);
    expect(ranking.runnersUp).toEqual([null, null]);
  });
});
