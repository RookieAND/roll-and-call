import { describe, expect, it } from "vitest";

import { finishedGridInsight } from "./finished-grid-insight";
import { openGridInsight } from "./open-grid-insight";

const FINISHED = [
  [0, 0, 1, 2, 4, 2, 0],
  [0, 0, 0, 2, 5, 2, 1],
  [0, 1, 0, 3, 5, 3, 0],
  [0, 0, 1, 3, 9, 5, 1],
  [0, 0, 1, 4, 8, 5, 2],
  [1, 3, 4, 5, 6, 2, 1],
  [1, 3, 3, 2, 2, 0, 0],
];

describe("격자 인사이트", () => {
  it("같은 시간대의 두 요일을 묶는다", () => {
    expect(finishedGridInsight(FINISHED)).toBe(
      "목요일·금요일 20–22시에 진행 세션이 가장 많습니다.",
    );
  });

  it("가장 많은 칸과 더 많은 이웃 시간대를 합친다", () => {
    const open = [[0, 0, 0, 1, 8, 6, 1]];
    expect(openGridInsight(open, false)).toBe(
      "모집 중인 세션 가운데 14건이 월요일 20–24시를 희망하고 있습니다.",
    );
  });

  it("시간 범위가 없는 이웃과는 합치지 않는다", () => {
    expect(openGridInsight([[5, 1, 0, 0, 0, 0, 0]], true)).toBe(
      "모집 중이거나 일정을 조율 중인 세션 가운데 5건이 월요일 오전을 희망하고 있습니다.",
    );
  });

  it("빈 격자는 문구가 없다", () => {
    expect(finishedGridInsight([[0, 0]])).toBeNull();
  });
});
