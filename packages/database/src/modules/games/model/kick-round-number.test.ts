import { describe, expect, it } from "vitest";

import { kickRoundNumber } from "./kick-round-number";

const rounds = [1, 2, 3].map((roundNo) => ({
  roundNo,
  startAt: new Date(Date.UTC(2026, 10, roundNo)),
}));

describe("kickRoundNumber", () => {
  it("시작이 같은 회차를 고른다", () => {
    expect(kickRoundNumber({ absenceAt: new Date(Date.UTC(2026, 10, 2)), rounds })).toBe(2);
  });

  it("같은 회차가 없으면 그 전에 마지막으로 시작한 회차다", () => {
    expect(kickRoundNumber({ absenceAt: new Date(Date.UTC(2026, 10, 3, 5)), rounds })).toBe(3);
  });

  it("시작한 회차가 없으면 null이다", () => {
    expect(kickRoundNumber({ absenceAt: new Date(Date.UTC(2026, 9, 1)), rounds })).toBeNull();
  });
});
