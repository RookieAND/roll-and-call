import { describe, expect, it } from "vitest";

import { abbreviatedNames } from "./abbreviated-names";
import { sessionWindowLabel } from "./session-window-label";

describe("abbreviatedNames", () => {
  it("두 명까지는 모두 적고, 셋부터는 「외 N인」으로 줄인다", () => {
    expect(abbreviatedNames(["오세진"])).toBe("오세진");
    expect(abbreviatedNames(["오세진", "정민서"])).toBe("오세진, 정민서");
    expect(abbreviatedNames(["오세진", "정민서", "이한울"])).toBe("오세진 외 2인");
  });
});

describe("sessionWindowLabel withDate", () => {
  it("날짜를 이미 고른 자리에서는 시각만 보인다", () => {
    expect(
      sessionWindowLabel({ iso: "2026-09-17T11:30:00.000Z", playMinutes: 180, withDate: false }),
    ).toBe("20:30 – 23:30");
  });
});
