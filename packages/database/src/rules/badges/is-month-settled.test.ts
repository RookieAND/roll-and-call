import { describe, expect, it } from "vitest";

import { isMonthSettled } from "./is-month-settled";

describe("isMonthSettled", () => {
  it("달이 끝나고 7일(한국 시각)이 지나야 굳는다", () => {
    expect(isMonthSettled("2026-09", new Date("2026-10-07T14:59:59Z"))).toBe(false);
    expect(isMonthSettled("2026-09", new Date("2026-10-07T15:00:00Z"))).toBe(true);
  });
});
