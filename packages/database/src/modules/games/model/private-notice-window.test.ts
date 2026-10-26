import { describe, expect, it } from "vitest";

import { privateNoticeWindows } from "./private-notice-window";

describe("privateNoticeWindows", () => {
  it("1시간 전 알림은 지금부터 1시간 뒤까지, 시작 안내는 30분 전부터 지금까지다", () => {
    const now = new Date("2026-11-01T12:00:00Z");
    const { reminder, start } = privateNoticeWindows(now);
    expect(reminder.from).toEqual(now);
    expect(reminder.to).toEqual(new Date("2026-11-01T13:00:00Z"));
    expect(start.from).toEqual(new Date("2026-11-01T11:30:00Z"));
    expect(start.to).toEqual(now);
  });
});
