import { describe, expect, it } from "vitest";

import { availabilityPrefill } from "./availability-prefill";
import { buildDayColumns } from "./build-day-columns";
import { buildTimeRows } from "./build-time-rows";
import { slotIso } from "./slot-iso";

// 2026-09-14는 월요일이다.
const monday = buildDayColumns({ rangeStart: "2026-09-14", rangeEnd: "2026-09-14" });
const MONDAY = 0;
const TUESDAY = 1;

describe("availabilityPrefill", () => {
  it("월요일 열의 자정 뒤 칸은 화요일 기본 시간으로 칠한다", () => {
    const prefill = availabilityPrefill({
      intervals: [{ day: TUESDAY, from: 0, to: 3 }],
      days: monday,
      timeRows: buildTimeRows({ startHour: 22, endHour: 2 }),
    });
    expect(prefill?.keys.toSorted()).toEqual(
      ["00:00", "00:30", "01:00", "01:30"].map((clock) => {
        const [hour, minute] = clock.split(":").map(Number);
        return slotIso({ date: "2026-09-15", hour: hour!, minute: minute! });
      }),
    );
  });

  it("시간대 밖 기본 시간은 버린다", () => {
    const prefill = availabilityPrefill({
      intervals: [{ day: MONDAY, from: 9, to: 12 }],
      days: monday,
      timeRows: buildTimeRows({ startHour: 12, endHour: 0 }),
    });
    expect(prefill).toBeNull();
  });

  it("오전 시간대면 오전 기본 시간을 칠한다", () => {
    const prefill = availabilityPrefill({
      intervals: [{ day: MONDAY, from: 9, to: 11 }],
      days: monday,
      timeRows: buildTimeRows({ startHour: 9, endHour: 13 }),
    });
    expect(prefill?.keys).toHaveLength(4);
    expect(prefill?.keys).toContain(slotIso({ date: "2026-09-14", hour: 9, minute: 0 }));
  });
});
