import assert from "node:assert";

import { rankPeople } from "./rank-people";

const person = (id: string) => ({ id, username: id, avatarUrl: null });

const podium = rankPeople([
  person("a"),
  person("b"),
  person("a"),
  person("c"),
  person("a"),
  person("c"),
  person("b"),
  person("d"),
]);
assert.deepEqual(
  podium.leaders.map((leader) => leader.id),
  ["a"],
);
assert.equal(podium.leaderCount, 3);
assert.deepEqual(
  podium.runnersUp.map((row) => row && [row.person.id, row.rank, row.count]),
  [
    ["b", 2, 2],
    ["c", 2, 2],
  ],
);

// 공동 1위 다음 점수대는 3위가 아니라 2위다.
const tied = rankPeople([person("a"), person("b"), person("c")]);
assert.deepEqual(
  tied.leaders.map((leader) => leader.id),
  ["a", "b", "c"],
);
assert.equal(tied.leaderCount, 1);
assert.deepEqual(tied.runnersUp, [null, null]);

const sparse = rankPeople([person("a"), person("a"), person("b")]);
assert.deepEqual(
  sparse.leaders.map((leader) => leader.id),
  ["a"],
);
assert.deepEqual(
  sparse.runnersUp.map((row) => row && [row.person.id, row.rank]),
  [["b", 2], null],
);

const empty = rankPeople([]);
assert.deepEqual(empty.leaders, []);
assert.deepEqual(empty.runnersUp, [null, null]);

console.log("rank-people.check ok");
