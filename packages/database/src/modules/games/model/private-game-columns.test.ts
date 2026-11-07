import { describe, expect, it } from "vitest";

import { privateEndDate } from "./private-game-columns";

const endDate = new Date("2026-11-01T00:00:00Z");

describe("privateEndDate", () => {
  it("세션 일시가 있으면 그 시각이다", () => {
    const confirmedAt = new Date("2026-11-21T11:00:00Z");
    expect(privateEndDate({ confirmedAt, rangeStart: "2026-11-14", endDate })).toEqual(confirmedAt);
  });

  it("일시를 정하기 전의 조율형은 조율 시작일 0시(KST)다", () => {
    expect(privateEndDate({ confirmedAt: null, rangeStart: "2026-11-14", endDate })).toEqual(
      new Date("2026-11-13T15:00:00Z"),
    );
  });

  it("둘 다 없으면 지금 값을 둔다", () => {
    expect(privateEndDate({ confirmedAt: undefined, rangeStart: null, endDate })).toEqual(endDate);
  });
});
