import { describe, expect, it } from "vitest";

import { CALENDAR_VIEWER_ROLE, canAddToCalendar } from "./can-add-to-calendar";

const NOW = new Date("2026-09-14T12:00:00+09:00");
const HOUR = 60 * 60 * 1000;
const scheduled = { cancelledAt: null, confirmedAt: new Date(NOW.getTime() + 24 * HOUR) };

describe("canAddToCalendar", () => {
  it("세션 시각이 정해진 뒤 시작 전이면 GM과 확정 참여자만 넣는다", () => {
    expect(
      canAddToCalendar({ game: scheduled, viewerRole: CALENDAR_VIEWER_ROLE.gm, now: NOW }),
    ).toBe(true);
    expect(
      canAddToCalendar({ game: scheduled, viewerRole: CALENDAR_VIEWER_ROLE.confirmed, now: NOW }),
    ).toBe(true);
  });

  it("대기자·추첨 결과 전 신청자·비참여자는 넣지 못한다", () => {
    expect(
      canAddToCalendar({ game: scheduled, viewerRole: CALENDAR_VIEWER_ROLE.other, now: NOW }),
    ).toBe(false);
  });

  it("시각 없음, 시작 뒤, 취소됨은 넣지 못한다", () => {
    const role = CALENDAR_VIEWER_ROLE.confirmed;
    expect(
      canAddToCalendar({ game: { ...scheduled, confirmedAt: null }, viewerRole: role, now: NOW }),
    ).toBe(false);
    expect(
      canAddToCalendar({
        game: { ...scheduled, confirmedAt: new Date(NOW.getTime() - HOUR) },
        viewerRole: role,
        now: NOW,
      }),
    ).toBe(false);
    expect(
      canAddToCalendar({ game: { ...scheduled, cancelledAt: NOW }, viewerRole: role, now: NOW }),
    ).toBe(false);
  });
});
