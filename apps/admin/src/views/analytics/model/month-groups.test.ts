import { describe, expect, it } from "vitest";

import { monthGroups } from "./month-groups";

describe("monthGroups", () => {
  it("이어진 같은 달을 한 칸으로 묶는다", () => {
    expect(monthGroups(["8월 4주차", "9월 1주차", "9월 2주차", "10월 1주차"])).toEqual([
      { month: "8월", span: 1 },
      { month: "9월", span: 2 },
      { month: "10월", span: 1 },
    ]);
  });
});
