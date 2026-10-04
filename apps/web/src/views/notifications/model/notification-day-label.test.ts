import { describe, expect, it } from "vitest";

import { notificationDayLabel } from "./notification-day-label";

const now = new Date("2026-10-05T12:00:00+09:00");

describe("notificationDayLabel", () => {
  it("KST 자정을 경계로 오늘·어제·M월 D일", () => {
    expect(notificationDayLabel(new Date("2026-10-05T00:00:00+09:00"), now)).toBe("오늘");
    expect(notificationDayLabel(new Date("2026-10-04T23:59:00+09:00"), now)).toBe("어제");
    expect(notificationDayLabel(new Date("2026-10-04T00:00:00+09:00"), now)).toBe("어제");
    expect(notificationDayLabel(new Date("2026-10-03T23:59:00+09:00"), now)).toBe("10월 3일");
  });
});
