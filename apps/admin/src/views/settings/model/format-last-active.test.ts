import { describe, expect, it } from "vitest";

import { formatLastActive } from "./format-last-active";

describe("formatLastActive", () => {
  const now = new Date("2026-09-25T10:00:00+09:00");

  it("오늘 활동은 시각을 붙인다", () => {
    expect(formatLastActive(new Date("2026-09-25T00:05:00+09:00"), now)).toBe("오늘 00:05");
  });

  it("어제 이전은 날짜만 보여 준다", () => {
    expect(formatLastActive(new Date("2026-09-24T23:59:00+09:00"), now)).toBe("2026년 9월 24일");
  });
});
