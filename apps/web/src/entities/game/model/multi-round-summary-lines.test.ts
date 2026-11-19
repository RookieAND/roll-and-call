import { describe, expect, it } from "vitest";

import { applySummaryLines } from "./apply-summary-lines";
import { multiRoundDetailRows } from "./multi-round-detail-rows";
import { roundSummaryLine } from "./round-summary-line";

const designated = {
  roundCount: 6,
  roundScheduleKind: "designated",
  repeatRule: { weekday: 6, startTime: "12:00", endTime: "16:00", intervalWeeks: 1 },
  confirmedAt: new Date("2026-10-24T12:00:00+09:00"),
  rangeStart: null,
  rangeEnd: null,
} as const;
const coordinated = { ...designated, roundScheduleKind: "coordinated", repeatRule: null } as const;
const coordinating = {
  ...coordinated,
  confirmedAt: null,
  rangeStart: "2026-10-24",
  rangeEnd: "2026-11-06",
} as const;

describe("다회차 상세 문구", () => {
  it("정보 표 첫 회·진행 줄", () => {
    expect(multiRoundDetailRows(designated)).toEqual({
      first: "10월 24일 (토) 오후 12:00~4:00",
      pace: "매주 토 · 총 6회",
    });
    expect(multiRoundDetailRows(coordinated)).toEqual({
      first: "10월 24일 (토) 오후 12:00부터",
      pace: "회차마다 정하며 총 6회",
    });
    expect(multiRoundDetailRows(coordinating)).toEqual({
      first: "10월 24일 ~ 11월 6일 중 조율",
      pace: "회차마다 정하며 총 6회",
    });
    expect(multiRoundDetailRows({ ...designated, roundCount: 1 })).toBeNull();
  });

  it("요약 한 줄", () => {
    expect(roundSummaryLine(designated)).toBe("총 6회 · 매주 토 오후 12:00~4:00");
    expect(roundSummaryLine({ ...designated, repeatRule: null })).toBe(
      "총 6회 · 회차마다 정합니다",
    );
    expect(roundSummaryLine(coordinated)).toBe("총 6회 · 회차마다 정합니다");
  });

  it("신청 시트 요약 카드", () => {
    expect(applySummaryLines(designated)).toEqual([
      "총 6회 · 매주 토 오후 12:00~4:00",
      "10월 24일부터 시작합니다.",
      "마지막 회차까지 함께해 주세요.",
    ]);
    expect(applySummaryLines(coordinated)).toEqual([
      "총 6회 · 회차마다 정합니다",
      "1회차는 10월 24일 (토) 오후 12:00입니다.",
      "마지막 회차까지 함께해 주세요.",
    ]);
    expect(applySummaryLines(coordinating)[1]).toBe("1회차는 10월 24일 ~ 11월 6일 중 정합니다.");
  });
});
