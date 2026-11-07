import { BADGE_LADDERS, HIDDEN_LADDER } from "@roll-and-call/database/badges/model";
import { describe, expect, it } from "vitest";

import { specialTitles } from "./special-titles";

describe("specialTitles", () => {
  it("세계의 주인을 받지 않았으면 잠긴 카드로 두고 「???」에는 세지 않는다", () => {
    const { lockedTitle, titles, unknownCount } = specialTitles({
      held: [],
      records: [],
      now: new Date(),
    });
    expect(lockedTitle).toMatchObject({
      emoji: "🪐",
      name: "세계의 주인",
      condition: "자작 룰이 승인되면 받습니다.",
    });
    expect(titles).toEqual([]);
    expect(unknownCount).toBe(
      Object.values(HIDDEN_LADDER).filter((ladder) => !BADGE_LADDERS[ladder].granted).length,
    );
  });
});
