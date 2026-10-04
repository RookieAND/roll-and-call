import { describe, expect, it } from "vitest";

import { sessionRangeText } from "./session-range-text";

describe("sessionRangeText", () => {
  it("같은 날이면 끝은 시각만 쓴다", () => {
    expect(
      sessionRangeText({
        startsAt: new Date("2026-09-16T20:00:00+09:00"),
        endsAt: new Date("2026-09-16T23:00:00+09:00"),
      }),
    ).toBe("9월 16일 (수) 20:00 ~ 23:00");
  });

  it("끝이 다음 날이면 끝에도 날짜를 쓴다", () => {
    expect(
      sessionRangeText({
        startsAt: new Date("2026-09-16T22:00:00+09:00"),
        endsAt: new Date("2026-09-17T01:00:00+09:00"),
      }),
    ).toBe("9월 16일 (수) 22:00 ~ 9월 17일 (목) 01:00");
  });
});
