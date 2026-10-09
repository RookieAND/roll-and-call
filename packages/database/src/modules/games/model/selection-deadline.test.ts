import { describe, expect, it } from "vitest";

import { selectionDeadline } from "./selection-deadline";

const endDate = new Date("2026-10-10T10:00:00Z");
const plus7 = new Date("2026-10-17T10:00:00Z");

describe("selectionDeadline", () => {
  it("기본은 마감 + 7일", () => {
    expect(
      selectionDeadline({ endDate, scheduleMode: "fixed", confirmedAt: null, rangeEnd: null }),
    ).toEqual(plus7);
  });

  it("일시 지정형은 시작이 마감 + 7일보다 이르면 시작 시각", () => {
    const start = new Date("2026-10-12T11:00:00Z");
    expect(
      selectionDeadline({ endDate, scheduleMode: "fixed", confirmedAt: start, rangeEnd: null }),
    ).toEqual(start);
  });

  it("일시 지정형은 시작이 마감 + 7일보다 늦으면 마감 + 7일", () => {
    expect(
      selectionDeadline({
        endDate,
        scheduleMode: "fixed",
        confirmedAt: new Date("2026-10-20T11:00:00Z"),
        rangeEnd: null,
      }),
    ).toEqual(plus7);
    expect(
      selectionDeadline({ endDate, scheduleMode: "fixed", confirmedAt: plus7, rangeEnd: null }),
    ).toEqual(plus7);
  });

  it("조율형은 조율 기간 종료일의 하루 끝(서울 24시)이 이르면 그때까지", () => {
    expect(
      selectionDeadline({
        endDate,
        scheduleMode: "coordinate",
        confirmedAt: null,
        rangeEnd: "2026-10-12",
      }),
    ).toEqual(new Date("2026-10-12T15:00:00Z"));
  });

  it("조율형은 종료일이 한참 뒤면 마감 + 7일", () => {
    expect(
      selectionDeadline({
        endDate,
        scheduleMode: "coordinate",
        confirmedAt: null,
        rangeEnd: "2026-11-30",
      }),
    ).toEqual(plus7);
  });
});
