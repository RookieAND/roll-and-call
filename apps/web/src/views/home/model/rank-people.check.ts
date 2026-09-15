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
  podium.map((row) => row && [row.person.id, row.rank, row.count]),
  [
    ["a", 1, 3],
    ["b", 2, 2],
    ["c", 2, 2],
  ],
);

const sparse = rankPeople([person("a"), person("a"), person("b")]);
assert.deepEqual(
  sparse.map((row) => row && [row.person.id, row.rank]),
  [["a", 1], ["b", 2], null],
);

assert.deepEqual(rankPeople([]), [null, null, null]);

console.log("rank-people.check ok");
