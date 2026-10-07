import { describe, expect, it } from "vitest";

import { minPlayersLine } from "./min-players-line";

const now = new Date("2026-09-20T00:00:00Z");
const future = new Date("2026-09-25T00:00:00Z");

describe("minPlayersLine", () => {
  it("최소 인원이 있고 마감 전이면 취소 조건을 알린다", () => {
    expect(minPlayersLine({ minPlayers: 3, endDate: future, now })).toBe(
      "신청자가 3명 미만이면 취소됩니다.",
    );
  });

  it("최소 인원이 없으면 줄이 없다", () => {
    expect(minPlayersLine({ minPlayers: null, endDate: future, now })).toBeNull();
  });

  it("마감이 지났거나 마감 시각이면 줄이 없다", () => {
    expect(
      minPlayersLine({ minPlayers: 3, endDate: new Date("2026-09-19T00:00:00Z"), now }),
    ).toBeNull();
    expect(minPlayersLine({ minPlayers: 3, endDate: now, now })).toBeNull();
  });
});
