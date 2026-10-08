import { describe, expect, it } from "vitest";

import { fixedSessionDates } from "./fixed-session-dates";

const now = new Date("2026-10-08T03:00:00Z");

describe("fixedSessionDates", () => {
  it("마감 날짜 앞은 흐리게, 마감 날짜부터 고를 수 있다(같은 날은 시각으로 거른다)", () => {
    const dates = fixedSessionDates({ endDate: new Date("2026-10-10T14:59:00Z"), now });
    expect(dates[0]).toMatchObject({ date: "2026-10-08", disabled: true });
    expect(dates.find((day) => day.date === "2026-10-09")?.disabled).toBe(true);
    expect(dates.find((day) => day.date === "2026-10-10")?.disabled).toBe(false);
    expect(dates).toHaveLength(60);
  });

  it("마감이 지났으면 오늘부터 고를 수 있다", () => {
    const dates = fixedSessionDates({ endDate: new Date("2026-10-01T00:00:00Z"), now });
    expect(dates[0]).toMatchObject({ date: "2026-10-08", disabled: false });
  });

  it("마감이 멀면 마감 7일 전부터 보인다", () => {
    const dates = fixedSessionDates({ endDate: new Date("2026-11-20T00:00:00Z"), now });
    expect(dates[0]?.date).toBe("2026-11-13");
    expect(dates.every((day) => day.date >= "2026-11-13")).toBe(true);
  });
});
