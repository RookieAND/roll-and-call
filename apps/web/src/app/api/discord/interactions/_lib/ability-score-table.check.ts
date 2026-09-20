import assert from "node:assert/strict";

import { abilityScoreTable } from "./ability-score-table";

// 한글 라벨은 글자 수가 아니라 고정폭 두 칸을 먹는다. 줄을 통째로 박아 정렬이 깨지면 잡는다.
assert.deepEqual(
  abilityScoreTable([
    { label: "근력", columns: [45, 60, 50] },
    { label: "건강", columns: [55, 40, 65] },
  ]).split("\n"),
  [
    "        1    2    3",
    "근력   45   60   50",
    "건강   55   40   65",
    "-------------------",
    "합계  100  100  115",
  ],
);

// 세 자리 합계도 열을 밀지 않는다.
assert.equal(
  abilityScoreTable([{ label: "지능", columns: [90, 5, 100] }])
    .split("\n")
    .at(-1),
  "합계   90    5  100",
);

console.log("ability-score-table.check ok");
