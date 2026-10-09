import { describe, expect, it } from "vitest";

import { SCHEDULE_BODY_MODE } from "./schedule-body-mode";
import { scheduleBodyModeOf } from "./schedule-body-mode-of";
import { SCHEDULE_NOTICE } from "./schedule-notices";

const base = {
  confirmedAt: null,
  canPaint: true,
  awaitingResult: null,
  unscheduled: false,
  isGm: false,
  isSignedIn: true,
  deadlinePassed: false,
};

describe("scheduleBodyModeOf", () => {
  it("확정되면 다른 조건보다 먼저 확정 모드다", () => {
    const confirmedAt = new Date("2026-10-10T11:00:00Z");
    expect(scheduleBodyModeOf({ ...base, confirmedAt, awaitingResult: "lottery" })).toEqual({
      kind: SCHEDULE_BODY_MODE.confirmed,
      confirmedAt,
    });
  });

  it("추첨 전이면 확정자 없음보다 추첨 안내가 먼저다", () => {
    expect(scheduleBodyModeOf({ ...base, awaitingResult: "lottery", unscheduled: true })).toEqual({
      kind: SCHEDULE_BODY_MODE.closed,
      notice: SCHEDULE_NOTICE.awaitingDraw,
    });
    expect(scheduleBodyModeOf({ ...base, unscheduled: true })).toEqual({
      kind: SCHEDULE_BODY_MODE.closed,
      notice: SCHEDULE_NOTICE.unscheduled,
    });
  });

  it("마감 지난 안내는 GM이 아닌 칠할 사람에게만 띄운다", () => {
    expect(scheduleBodyModeOf({ ...base, deadlinePassed: true })).toEqual({
      kind: SCHEDULE_BODY_MODE.paint,
      showDeadlineNotice: true,
    });
    expect(scheduleBodyModeOf({ ...base, deadlinePassed: true, isGm: true })).toEqual({
      kind: SCHEDULE_BODY_MODE.paint,
      showDeadlineNotice: false,
    });
  });

  it("칠할 수 없으면 보기만 한다", () => {
    expect(scheduleBodyModeOf({ ...base, canPaint: false, isSignedIn: false })).toEqual({
      kind: SCHEDULE_BODY_MODE.viewOnly,
      isSignedIn: false,
    });
  });
});
