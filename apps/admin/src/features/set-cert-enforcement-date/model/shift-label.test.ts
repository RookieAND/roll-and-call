import { describe, expect, it } from "vitest";

import { shiftLabel } from "./shift-label";

describe("shiftLabel", () => {
  const from = new Date("2026-10-31T00:00:00+09:00");

  it("늦추면 연장, 당기면 앞당김, 같으면 없음", () => {
    expect(shiftLabel({ from, to: new Date("2026-11-14T00:00:00+09:00") })).toBe("14일 연장");
    expect(shiftLabel({ from, to: new Date("2026-10-29T00:00:00+09:00") })).toBe("2일 앞당김");
    expect(shiftLabel({ from, to: from })).toBeNull();
  });
});
