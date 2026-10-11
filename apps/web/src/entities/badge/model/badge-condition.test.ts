import { BADGE_LADDER, BADGE_LADDERS } from "@roll-and-call/database/badges/model";
import { describe, expect, it } from "vitest";

import { badgeCondition } from "./badge-condition";

describe("badgeCondition", () => {
  it("룰북 인증 칭호는 목록과 같은 설명을 먼저, 기준을 아래에 적는다", () => {
    const step = BADGE_LADDERS[BADGE_LADDER.scholar].steps[0]!;
    expect(badgeCondition({ ladder: BADGE_LADDER.scholar, step, categoryName: null })).toBe(
      "막 룰북을 펼치기 시작한 학도입니다.\n룰북 3종 인증",
    );
  });

  it("횟수형 뱃지는 기준만 적는다", () => {
    const step = BADGE_LADDERS[BADGE_LADDER.playerTotal].steps[0]!;
    expect(badgeCondition({ ladder: BADGE_LADDER.playerTotal, step, categoryName: null })).toBe(
      `세션 ${step.threshold}회 참석`,
    );
  });
});
