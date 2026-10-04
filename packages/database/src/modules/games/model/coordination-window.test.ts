import { describe, expect, it } from "vitest";

import { crossesMidnight, DEFAULT_WINDOW, windowHours } from "./coordination-window";

describe("coordination window", () => {
  it("12~0은 12시간이고 자정을 넘긴다", () => {
    expect(windowHours(DEFAULT_WINDOW)).toBe(12);
    expect(crossesMidnight(DEFAULT_WINDOW)).toBe(true);
  });

  it("22~2는 4시간이고 자정을 넘긴다", () => {
    expect(windowHours({ startHour: 22, endHour: 2 })).toBe(4);
    expect(crossesMidnight({ startHour: 22, endHour: 2 })).toBe(true);
  });

  it("9~18은 9시간이고 넘기지 않는다", () => {
    expect(windowHours({ startHour: 9, endHour: 18 })).toBe(9);
    expect(crossesMidnight({ startHour: 9, endHour: 18 })).toBe(false);
  });
});
