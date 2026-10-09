import { describe, expect, it } from "vitest";

import { formatPlayRange } from "./format-play-range";

describe("formatPlayRange", () => {
  it.each([
    [180, 180, "3시간"],
    [180, 300, "3~5시간"],
    [210, 300, "3시간 30분~5시간"],
    [30, 60, "30분~1시간"],
    [30, 45, "30~45분"],
    [null, 180, "3시간"],
    [null, null, null],
  ])("(%s,%s) → %s", (min, max, expected) => {
    expect(formatPlayRange(min, max)).toBe(expected);
  });
});
