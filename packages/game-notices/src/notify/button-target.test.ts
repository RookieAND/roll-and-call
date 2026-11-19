import { describe, expect, it } from "vitest";

import { parseButtonTarget } from "./button-target";

describe("시작 안내 버튼 대상", () => {
  it("회차 번호가 붙어 있으면 나눈다", () => {
    expect(parseButtonTarget("g1.3")).toEqual({ gameId: "g1", roundNo: 3 });
    expect(parseButtonTarget("g1")).toEqual({ gameId: "g1" });
    expect(parseButtonTarget("g1.x")).toEqual({ gameId: "g1" });
  });
});
