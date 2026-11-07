import { BADGE_LADDER, BADGE_LADDERS, HIDDEN_LADDER } from "@roll-and-call/database/badges/model";
import { describe, expect, it } from "vitest";

import { specialTitles } from "./special-titles";

describe("specialTitles", () => {
  it("세계의 주인은 숨겨진 칭호라 받기 전에는 「???」로만 센다", () => {
    const { titles, unknownCount } = specialTitles({ held: [], records: [], now: new Date() });
    expect(titles).toEqual([]);
    expect(BADGE_LADDERS[BADGE_LADDER.worldOwner].granted).toBe(false);
    expect(Object.values(HIDDEN_LADDER)).toContain(BADGE_LADDER.worldOwner);
    expect(unknownCount).toBe(
      Object.values(HIDDEN_LADDER).filter((ladder) => !BADGE_LADDERS[ladder].granted).length,
    );
  });
});
