import { describe, expect, it } from "vitest";

import { COC_CHECK_LEVEL, judgeCocCheck } from "./judge-coc-check";

describe("judgeCocCheck", () => {
  it.each([
    [1, 60, COC_CHECK_LEVEL.criticalSuccess],
    [12, 60, COC_CHECK_LEVEL.extremeSuccess],
    [13, 60, COC_CHECK_LEVEL.hardSuccess],
    [30, 60, COC_CHECK_LEVEL.hardSuccess],
    [31, 60, COC_CHECK_LEVEL.success],
    [60, 60, COC_CHECK_LEVEL.success],
    [61, 60, COC_CHECK_LEVEL.failure],
    [99, 60, COC_CHECK_LEVEL.failure],
    [100, 60, COC_CHECK_LEVEL.fumble],
    [95, 40, COC_CHECK_LEVEL.failure],
    [96, 40, COC_CHECK_LEVEL.fumble],
    [1, 1, COC_CHECK_LEVEL.criticalSuccess],
  ])("%i를 목표값 %i로 굴리면 %s", (roll, target, level) => {
    expect(judgeCocCheck({ roll, target })).toBe(level);
  });
});
