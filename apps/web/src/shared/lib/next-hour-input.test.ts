import { describe, expect, it } from "vitest";

import { nextHourInput } from "./next-hour-input";

describe("nextHourInput", () => {
  it("분이 있어도 한 시간 뒤 정시로 맞춘다", () => {
    expect(nextHourInput(new Date("2026-10-25T08:30:00Z"))).toBe("2026-10-25T18:00");
    expect(nextHourInput(new Date("2026-10-25T08:00:00Z"))).toBe("2026-10-25T18:00");
  });

  it("KST 기준으로 날짜를 넘긴다", () => {
    expect(nextHourInput(new Date("2026-10-25T14:10:00Z"))).toBe("2026-10-26T00:00");
  });
});
