import { formatDate } from "@roll-and-call/database/moderation/model";
import { describe, expect, it } from "vitest";

import { formatDateTime } from "./format-date-time";
import { formatDayRange } from "./format-day-range";
import { formatSessionTime } from "./format-session-time";
import { formatTime } from "./format-time";

describe("날짜 표기", () => {
  it("formatDate는 연도까지 쓴다", () => {
    expect(formatDate(new Date("2026-09-22T03:00:00Z"))).toBe("2026년 9월 22일");
  });

  it("formatDateTime은 한국 시간으로 연·월·일·시각을 쓴다", () => {
    expect(formatDateTime(new Date("2026-09-22T05:36:00Z"))).toBe("2026년 9월 22일 14:36");
  });

  it("formatSessionTime은 요일 한 글자를 괄호로 붙인다", () => {
    expect(formatSessionTime(new Date("2026-09-20T11:00:00Z"))).toBe("2026년 9월 20일 (일) 20:00");
  });

  it("formatTime은 KST 시각만 쓴다", () => {
    expect(formatTime(new Date("2026-09-21T15:05:00Z"))).toBe("00:05");
  });

  it("KST 자정을 넘기면 다음 날이다", () => {
    expect(formatDate(new Date("2026-09-21T15:00:00Z"))).toBe("2026년 9월 22일");
    expect(formatDateTime(new Date("2026-09-21T14:59:00Z"))).toBe("2026년 9월 21일 23:59");
  });
});

describe("formatDayRange", () => {
  it("같은 달이면 끝은 날짜만 쓴다", () => {
    expect(formatDayRange(new Date("2026-09-16T03:00:00Z"), new Date("2026-09-22T03:00:00Z"))).toBe(
      "2026년 9월 16일~22일",
    );
  });

  it("달이 바뀌면 끝에 달을 쓴다", () => {
    expect(formatDayRange(new Date("2026-08-30T03:00:00Z"), new Date("2026-09-05T03:00:00Z"))).toBe(
      "2026년 8월 30일~9월 5일",
    );
  });

  it("해가 바뀌면 끝에도 연도를 쓴다", () => {
    expect(formatDayRange(new Date("2026-12-30T03:00:00Z"), new Date("2027-01-05T03:00:00Z"))).toBe(
      "2026년 12월 30일~2027년 1월 5일",
    );
  });
});
