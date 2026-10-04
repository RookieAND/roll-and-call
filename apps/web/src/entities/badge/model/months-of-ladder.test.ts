import { BADGE_LADDER } from "@roll-and-call/database/badges/model";
import { describe, expect, it } from "vitest";

import { monthsOfLadder } from "./months-of-ladder";

describe("monthsOfLadder", () => {
  it("그 칭호의 달만 최근 달부터 돌려준다", () => {
    const records = [
      { badgeKey: "gm.monthly.2026-07" },
      { badgeKey: "pl.monthly.2026-08" },
      { badgeKey: "gm.monthly.2026-09" },
      { badgeKey: "pl.total" },
    ];
    expect(monthsOfLadder({ ladder: BADGE_LADDER.gmMonthly, records })).toEqual([
      "2026-09",
      "2026-07",
    ]);
  });

  it("받은 적 없으면 빈 목록이다", () => {
    expect(monthsOfLadder({ ladder: BADGE_LADDER.playerMonthly, records: [] })).toEqual([]);
  });
});
