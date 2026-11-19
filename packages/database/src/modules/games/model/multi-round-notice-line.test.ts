import { describe, expect, it } from "vitest";

import { multiRoundNoticeLine } from "./multi-round-notice-line";

const base = {
  roundCount: 6,
  roundScheduleKind: "designated" as const,
  repeatRule: { weekday: 6, startTime: "12:00", endTime: "16:00", intervalWeeks: 1 },
  confirmedAt: new Date("2026-10-24T03:00:00Z"),
};

describe("다회차 일정 한 줄", () => {
  it("지정형 반복은 요일과 시각을 보인다", () => {
    expect(multiRoundNoticeLine(base)).toBe("총 6회 · 매주 토 오후 12:00~4:00");
    expect(
      multiRoundNoticeLine({
        ...base,
        repeatRule: { weekday: 5, startTime: "10:30", endTime: "13:00", intervalWeeks: 2 },
      }),
    ).toBe("총 6회 · 격주 금 오전 10:30~오후 1:00");
  });

  it("조율형은 회차마다 정한다고 보이고 한 번이면 없다", () => {
    expect(multiRoundNoticeLine({ ...base, roundScheduleKind: "coordinated" })).toBe(
      "총 6회 · 회차마다 일정을 정합니다",
    );
    expect(multiRoundNoticeLine({ ...base, roundCount: 1 })).toBeNull();
  });
});
