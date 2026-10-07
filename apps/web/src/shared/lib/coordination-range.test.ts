import { describe, expect, it } from "vitest";

import { coordinationRange } from "./coordination-range";

describe("coordinationRange", () => {
  it("저장한 날(KST)부터 14일 뒤까지다", () => {
    expect(coordinationRange(new Date("2026-09-10T16:00:00Z"))).toEqual({
      rangeStart: "2026-09-11",
      rangeEnd: "2026-09-25",
    });
  });
});
