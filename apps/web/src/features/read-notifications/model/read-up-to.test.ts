import { describe, expect, it } from "vitest";

import { readUpTo } from "./read-up-to";

const now = new Date("2026-10-05T12:00:00Z");

describe("readUpTo", () => {
  it("지난 시각은 그대로", () => {
    expect(readUpTo({ upTo: "2026-10-05T11:00:00.000Z", now })).toEqual(
      new Date("2026-10-05T11:00:00Z"),
    );
  });

  it("미래나 잘못된 값은 지금으로", () => {
    expect(readUpTo({ upTo: "2026-10-06T00:00:00.000Z", now })).toBe(now);
    expect(readUpTo({ upTo: "garbage", now })).toBe(now);
  });
});
