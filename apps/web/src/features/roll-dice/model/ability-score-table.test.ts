import { describe, expect, it } from "vitest";

import { abilityScoreTable } from "./ability-score-table";

describe("abilityScoreTable", () => {
  // 한글 라벨은 글자 수가 아니라 고정폭 두 칸을 먹는다. 줄을 통째로 박아 정렬이 깨지면 잡는다.
  it("한글 라벨 너비에 맞춰 열을 세운다", () => {
    expect(
      abilityScoreTable([
        { label: "근력", columns: [45, 60, 50] },
        { label: "건강", columns: [55, 40, 65] },
      ]).split("\n"),
    ).toEqual([
      "        1    2    3",
      "근력   45   60   50",
      "건강   55   40   65",
      "-------------------",
      "합계  100  100  115",
    ]);
  });

  it("세 자리 합계도 열을 밀지 않는다", () => {
    expect(
      abilityScoreTable([{ label: "지능", columns: [90, 5, 100] }])
        .split("\n")
        .at(-1),
    ).toBe("합계   90    5  100");
  });
});
