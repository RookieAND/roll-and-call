import { describe, expect, it } from "vitest";

import { roundCoordinationError } from "./round-coordination-error";

const today = "2026-12-01";

describe("roundCoordinationError", () => {
  it("14일까지 허용, 15일은 거절", () => {
    expect(roundCoordinationError({ start: today, end: "2026-12-14", today })).toBeNull();
    expect(roundCoordinationError({ start: today, end: "2026-12-15", today })).toBe(
      "조율 기간은 14일을 넘을 수 없습니다.",
    );
  });
  it("끝이 시작보다 앞서거나 지난 날짜면 거절", () => {
    expect(roundCoordinationError({ start: "2026-12-05", end: "2026-12-04", today })).toBe(
      "끝나는 날은 시작하는 날보다 앞설 수 없습니다.",
    );
    expect(roundCoordinationError({ start: "2026-11-30", end: "2026-12-04", today })).toBe(
      "지난 날짜로는 열 수 없습니다.",
    );
  });
});
