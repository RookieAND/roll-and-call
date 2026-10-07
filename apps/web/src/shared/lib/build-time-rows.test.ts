import { describe, expect, it } from "vitest";

import { buildTimeRows } from "./build-time-rows";
import { rowSlotIso } from "./row-slot-iso";

describe("buildTimeRows", () => {
  it("12~0은 12:00~23:30 24줄이고 모두 같은 날이다", () => {
    const rows = buildTimeRows({ startHour: 12, endHour: 0 });
    expect(rows).toHaveLength(24);
    expect(rows[0]!.label).toBe("12:00");
    expect(rows.at(-1)!.label).toBe("23:30");
    expect(rows.every((row) => row.dayOffset === 0)).toBe(true);
  });

  it("22~2는 8줄이고 자정 뒤 4줄은 다음 날이다", () => {
    const rows = buildTimeRows({ startHour: 22, endHour: 2 });
    expect(rows.map((row) => row.label)).toEqual([
      "22:00",
      "22:30",
      "23:00",
      "23:30",
      "00:00",
      "00:30",
      "01:00",
      "01:30",
    ]);
    expect(rows.map((row) => row.dayOffset)).toEqual([0, 0, 0, 0, 1, 1, 1, 1]);
  });

  it("0~6은 12줄이고 모두 같은 날이다", () => {
    const rows = buildTimeRows({ startHour: 0, endHour: 6 });
    expect(rows).toHaveLength(12);
    expect(rows.every((row) => row.dayOffset === 0)).toBe(true);
  });
});

describe("rowSlotIso", () => {
  it("자정 뒤 줄은 열 날짜 다음 날 KST 시각이다", () => {
    const rows = buildTimeRows({ startHour: 22, endHour: 2 });
    expect(rowSlotIso({ date: "2026-09-14", row: rows[6]! })).toBe("2026-09-14T16:00:00.000Z");
    expect(rowSlotIso({ date: "2026-09-14", row: rows[0]! })).toBe("2026-09-14T13:00:00.000Z");
  });
});
