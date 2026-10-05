import { describe, expect, it } from "vitest";

import { rankPeople } from "./rank-people";

const person = (id: string) => ({ id, username: id, avatarUrl: null });
const people = new Map(["a", "b", "c", "d"].map((id) => [id, person(id)]));
const row = (userId: string, rank: number, score: number) => ({
  userId,
  rank,
  score,
  sessionCount: 1,
});

describe("rankPeople", () => {
  it("1위가 한 장이고 다음 점수대가 2·3위다", () => {
    const podium = rankPeople([row("a", 1, 300), row("b", 2, 200), row("c", 3, 100)], people);
    expect(podium.leaders.map((leader) => leader.person.id)).toEqual(["a"]);
    expect(podium.leaders[0]!.score).toBe(300);
    expect(podium.runnersUp.map((item) => item && [item.person.id, item.rank, item.score])).toEqual(
      [
        ["b", 2, 200],
        ["c", 3, 100],
      ],
    );
  });

  it("동점 1위는 전원이다", () => {
    const tied = rankPeople([row("a", 1, 100), row("b", 1, 100), row("c", 1, 100)], people);
    expect(tied.leaders.map((leader) => leader.person.id)).toEqual(["a", "b", "c"]);
    expect(tied.runnersUp).toEqual([null, null]);
  });

  it("자리가 모자라면 빈 칸으로 둔다", () => {
    const sparse = rankPeople([row("a", 1, 100), row("b", 2, 50)], people);
    expect(sparse.runnersUp.map((item) => item && item.person.id)).toEqual(["b", null]);
  });

  it("아무도 없으면 빈 시상대다", () => {
    const empty = rankPeople([], people);
    expect(empty.leaders).toEqual([]);
    expect(empty.runnersUp).toEqual([null, null]);
  });
});
