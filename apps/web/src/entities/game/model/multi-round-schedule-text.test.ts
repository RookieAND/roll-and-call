import { describe, expect, it } from "vitest";

import { multiRoundScheduleText } from "./multi-round-schedule-text";

const base = {
  roundCount: 6,
  roundScheduleKind: "designated",
  repeatRule: { weekday: 6, startTime: "12:00", endTime: "16:00", intervalWeeks: 1 },
  confirmedAt: new Date("2026-10-24T12:00:00+09:00"),
  rangeStart: null,
  rangeEnd: null,
} as const;

describe("multiRoundScheduleText", () => {
  it("한 번이면 null", () => {
    expect(multiRoundScheduleText({ ...base, roundCount: 1 })).toBeNull();
  });

  it("지정형 반복", () => {
    expect(multiRoundScheduleText(base)).toBe("매주 토 오후 12:00~4:00 · 총 6회");
    expect(
      multiRoundScheduleText({ ...base, repeatRule: { ...base.repeatRule, intervalWeeks: 2 } }),
    ).toBe("격주 토 오후 12:00~4:00 · 총 6회");
  });

  it("직접 입력과 조율형 1회차 일시", () => {
    const text = "10월 24일 (토) 오후 12:00부터 · 총 6회";
    expect(multiRoundScheduleText({ ...base, repeatRule: null })).toBe(text);
    expect(
      multiRoundScheduleText({ ...base, roundScheduleKind: "coordinated", repeatRule: null }),
    ).toBe(text);
  });

  it("조율형 범위 조율과 미정", () => {
    const coordinated = { ...base, roundScheduleKind: "coordinated", repeatRule: null } as const;
    expect(
      multiRoundScheduleText({
        ...coordinated,
        confirmedAt: null,
        rangeStart: "2026-10-20",
        rangeEnd: "2026-10-30",
      }),
    ).toBe("일정 조율 · 총 6회");
    expect(multiRoundScheduleText({ ...coordinated, confirmedAt: null })).toBe(
      "일정 미정 · 총 6회",
    );
  });
});
