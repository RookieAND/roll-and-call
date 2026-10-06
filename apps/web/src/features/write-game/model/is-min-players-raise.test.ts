import { describe, expect, it } from "vitest";

import { isMinPlayersRaise } from "./is-min-players-raise";

describe("isMinPlayersRaise", () => {
  it.each([
    [3, 4, true],
    [3, 3, false],
    [3, 2, false],
    [3, null, false],
    [null, 2, true],
    [null, null, false],
  ])("저장 %s → %s는 올리기 %s", (saved, next, expected) => {
    expect(isMinPlayersRaise({ saved, next })).toBe(expected);
  });
});
