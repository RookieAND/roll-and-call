import { describe, expect, it } from "vitest";

import { buildTimeRows, slotIso } from "@/shared/lib";

import { initialSessionStart } from "./initial-session-start";
import { toSessionStart } from "./session-start";
import { sessionStartIso } from "./session-start-iso";
import { sessionTimeOptions } from "./session-time-options";
import { sessionWindowLabel } from "./session-window-label";

const LATE = { startHour: 22, endHour: 2 };
const NOON = { startHour: 12, endHour: 0 };

describe("toSessionStart · sessionStartIso", () => {
  it("자정 뒤 시각은 전날 열 + 1440분 이상으로 바꾸고 되돌린다", () => {
    const iso = slotIso({ date: "2026-09-18", hour: 1, minute: 0 });
    const start = toSessionStart({ iso, window: LATE });
    expect(start).toEqual({ date: "2026-09-17", minutes: 1500 });
    expect(sessionStartIso(start)).toBe(iso);
  });

  it("자정을 넘지 않는 시간대는 그 날 그대로다", () => {
    const iso = slotIso({ date: "2026-09-18", hour: 20, minute: 30 });
    expect(toSessionStart({ iso, window: NOON })).toEqual({ date: "2026-09-18", minutes: 1230 });
  });

  it("시간대 밖 시각은 그대로 두고 선택지에 하나 더한다", () => {
    const iso = slotIso({ date: "2026-09-18", hour: 9, minute: 0 });
    const start = toSessionStart({ iso, window: LATE });
    expect(start).toEqual({ date: "2026-09-18", minutes: 540 });
    expect(sessionStartIso(start)).toBe(iso);
    const options = sessionTimeOptions({
      timeRows: buildTimeRows(LATE),
      selectedMinutes: start.minutes,
    });
    expect(options).toHaveLength(9);
    expect(options[0]!.label).toBe("09:00");
  });

  it("선택지는 시간대 줄이고 자정 뒤는 +1을 붙인다", () => {
    const options = sessionTimeOptions({ timeRows: buildTimeRows(LATE), selectedMinutes: 1320 });
    expect(options.map((option) => option.label)).toEqual([
      "22:00",
      "22:30",
      "23:00",
      "23:30",
      "00:00 +1",
      "00:30 +1",
      "01:00 +1",
      "01:30 +1",
    ]);
  });
});

describe("initialSessionStart", () => {
  it("시간대에 19:00이 있으면 조율 첫날 19:00, 없으면 첫 줄", () => {
    const base = { seedIso: null, rangeStart: "2026-09-17" };
    expect(initialSessionStart({ ...base, window: NOON, timeRows: buildTimeRows(NOON) })).toEqual({
      date: "2026-09-17",
      minutes: 1140,
    });
    expect(initialSessionStart({ ...base, window: LATE, timeRows: buildTimeRows(LATE) })).toEqual({
      date: "2026-09-17",
      minutes: 1320,
    });
  });
});

describe("sessionWindowLabel", () => {
  it("끝이 다음 날이면 (+1)을 붙인다", () => {
    const iso = slotIso({ date: "2026-09-17", hour: 22, minute: 30 });
    expect(sessionWindowLabel({ iso, playMinutes: 180 })).toBe("9/17 (목) 22:30 – 01:30(+1)");
  });

  it("같은 날에 끝나면 붙이지 않는다", () => {
    const iso = slotIso({ date: "2026-09-17", hour: 20, minute: 30 });
    expect(sessionWindowLabel({ iso, playMinutes: 180 })).toBe("9/17 (목) 20:30 – 23:30");
  });
});
