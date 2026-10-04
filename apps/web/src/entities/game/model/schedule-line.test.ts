import { describe, expect, it } from "vitest";

import { scheduleLine } from "./schedule-line";
import { SCHEDULE_MODE } from "./schedule-mode";

const NOW = new Date("2026-09-14T12:00:00+09:00");
const base = {
  confirmedAt: new Date("2026-09-16T20:00:00+09:00"),
  rangeStart: null,
  rangeEnd: null,
  endDate: new Date("2026-09-15T19:00:00+09:00"),
};

describe("scheduleLine", () => {
  it("일시 지정형도 일시가 있으면 확정으로 보고, 글자 끝 확정은 붙이지 않는다", () => {
    const line = scheduleLine({ ...base, scheduleMode: SCHEDULE_MODE.fixed }, NOW);
    expect(line.confirmed).toBe(true);
    expect(line.text).toBe("9월 16일 (수) 20:00");
  });

  it("조율형은 일시를 확정하면 글자 끝에 확정을 붙인다", () => {
    const line = scheduleLine({ ...base, scheduleMode: SCHEDULE_MODE.coordinate }, NOW);
    expect(line.confirmed).toBe(true);
    expect(line.text).toBe("9월 16일 (수) 20:00 확정");
  });

  it("일시가 없으면 확정이 아니다", () => {
    const line = scheduleLine(
      { ...base, confirmedAt: null, scheduleMode: SCHEDULE_MODE.coordinate },
      NOW,
    );
    expect(line.confirmed).toBe(false);
  });
});
