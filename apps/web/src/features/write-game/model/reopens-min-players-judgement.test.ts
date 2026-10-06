import { describe, expect, it } from "vitest";

import { reopensMinPlayersJudgement } from "./reopens-min-players-judgement";

const now = new Date("2026-09-10T10:00:00Z");
const previousEndDate = new Date("2026-09-09T10:00:00Z");

describe("reopensMinPlayersJudgement", () => {
  it("마감을 미래로 고치면 다시 판정한다", () => {
    const nextEndDate = new Date("2026-09-12T10:00:00Z");
    expect(reopensMinPlayersJudgement({ previousEndDate, nextEndDate, now })).toBe(true);
  });

  it("마감이 그대로면 다시 판정하지 않는다", () => {
    expect(reopensMinPlayersJudgement({ previousEndDate, nextEndDate: previousEndDate, now })).toBe(
      false,
    );
  });

  it("마감을 과거로 고치면 다시 판정하지 않는다", () => {
    const nextEndDate = new Date("2026-09-08T10:00:00Z");
    expect(reopensMinPlayersJudgement({ previousEndDate, nextEndDate, now })).toBe(false);
  });

  it("미래 마감을 더 이른 미래로 고쳐도 다시 판정한다", () => {
    const future = new Date("2026-09-20T10:00:00Z");
    const nextEndDate = new Date("2026-09-15T10:00:00Z");
    expect(reopensMinPlayersJudgement({ previousEndDate: future, nextEndDate, now })).toBe(true);
  });
});
