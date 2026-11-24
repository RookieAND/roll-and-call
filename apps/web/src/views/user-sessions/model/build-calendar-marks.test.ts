import { describe, expect, it } from "vitest";

import type { SessionCardModel } from "@/widgets/session-list";

import { buildCalendarMarks } from "./build-calendar-marks";
import type { UpcomingRow } from "./upcoming-row";

const past = (startsAt: string | null, partial: Partial<SessionCardModel> = {}) =>
  ({ startsAt, cancelled: false, hidden: false, ...partial }) as SessionCardModel;

describe("buildCalendarMarks", () => {
  it("날짜별로 예정·지난 표시를 합치고 취소·숨김·일정 없는 것은 뺀다", () => {
    const marks = buildCalendarMarks({
      upcomingRows: [
        { startsAt: new Date("2026-11-27T10:00:00+09:00") },
        { startsAt: null },
      ] as UpcomingRow[],
      pastCards: [
        past("2026-11-27T01:00:00+09:00"),
        past("2026-11-20T10:00:00+09:00"),
        past("2026-11-21T10:00:00+09:00", { cancelled: true }),
        past("2026-11-22T10:00:00+09:00", { hidden: true }),
        past(null),
      ],
    });
    expect(marks).toEqual({
      "2026-11-27": { upcoming: true, past: true },
      "2026-11-20": { upcoming: false, past: true },
    });
  });
});
