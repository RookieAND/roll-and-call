import { describe, expect, it } from "vitest";

import { buildDayColumns, buildTimeRows, rowSlotIso } from "@/shared/lib";

import { AVAILABILITY_CHANGE } from "./availability-change";
import { availabilityChanges } from "./availability-changes";
import { availabilityTotalText } from "./availability-total-text";
import { dayRangesText } from "./day-ranges-text";

const days = buildDayColumns({ rangeStart: "2026-09-16", rangeEnd: "2026-09-17" });
const timeRows = buildTimeRows({ startHour: 22, endHour: 2 });
const keyOf = (date: string, index: number) => rowSlotIso({ date, row: timeRows[index]! });

describe("dayRangesText", () => {
  it("이어진 줄을 한 구간으로 묶고 자정 뒤 끝은 00:00 다음 시각으로 쓴다", () => {
    const picked = new Set([0, 1, 3, 4, 7].map((index) => keyOf("2026-09-16", index)));
    expect(
      dayRangesText({ date: "2026-09-16", timeRows, isIncluded: (key) => picked.has(key) }),
    ).toBe("22:00 – 23:00, 23:30 – 00:30, 01:30 – 02:00");
  });

  it("고른 줄이 없으면 빈 문자열이다", () => {
    expect(dayRangesText({ date: "2026-09-16", timeRows, isIncluded: () => false })).toBe("");
  });
});

describe("availabilityTotalText", () => {
  it("칸 수를 30분 단위 시간으로 쓴다", () => {
    expect(availabilityTotalText({ dayCount: 7, filledDayCount: 4, slotCount: 15 })).toBe(
      "7일 중 4일 · 7시간 30분",
    );
    expect(availabilityTotalText({ dayCount: 7, filledDayCount: 1, slotCount: 1 })).toBe(
      "7일 중 1일 · 30분",
    );
    expect(availabilityTotalText({ dayCount: 7, filledDayCount: 0, slotCount: 0 })).toBe(
      "7일 중 0일 · 0시간",
    );
  });
});

describe("availabilityChanges", () => {
  it("날짜마다 추가 다음 지움을 늘어놓고 바뀌지 않은 날은 뺀다", () => {
    const saved = new Set([keyOf("2026-09-16", 0), keyOf("2026-09-17", 2)]);
    const selected = new Set([keyOf("2026-09-16", 1), keyOf("2026-09-17", 2)]);
    const changes = availabilityChanges({ days, timeRows, selected, saved });
    expect(changes.map(({ kind, day, ranges }) => [kind, day.date, ranges])).toEqual([
      [AVAILABILITY_CHANGE.added, "2026-09-16", "22:30 – 23:00"],
      [AVAILABILITY_CHANGE.removed, "2026-09-16", "22:00 – 22:30"],
    ]);
  });
});
