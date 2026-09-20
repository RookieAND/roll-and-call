import { describe, expect, it } from "vitest";

import { SCHEDULE_MODE } from "./schedule-mode";
import { deriveSessionState, SESSION_STATE } from "./session";

const NOW = new Date("2026-09-14T12:00:00+09:00");
const HOUR = 60 * 60 * 1000;
const fromNow = (hours: number) => new Date(NOW.getTime() + hours * HOUR);

const coordinating = {
  confirmedAt: null,
  playMinutes: 180,
  endDate: fromNow(48),
  maxPlayers: 4,
  confirmedCount: 4,
  scheduleMode: SCHEDULE_MODE.coordinate,
};

describe("deriveSessionState", () => {
  it("자리가 남아 있으면 모집 중이다", () => {
    expect(deriveSessionState({ ...coordinating, confirmedCount: 1 }, NOW)).toBe(
      SESSION_STATE.recruiting,
    );
  });

  it("조율형은 정원이 차면 일정 조율로 넘어간다", () => {
    expect(deriveSessionState(coordinating, NOW)).toBe(SESSION_STATE.scheduling);
  });

  it("일시 지정형은 정원이 차면 확정을 기다린다", () => {
    expect(
      deriveSessionState(
        { ...coordinating, confirmedAt: null, scheduleMode: SCHEDULE_MODE.fixed },
        NOW,
      ),
    ).toBe(SESSION_STATE.pendingConfirm);
  });

  it("시간을 정하지 못한 채 기한이 지나면 무산이다", () => {
    expect(
      deriveSessionState({ ...coordinating, endDate: fromNow(-1), confirmedCount: 0 }, NOW),
    ).toBe(SESSION_STATE.closed);
  });

  it("시작했어도 플레이타임이 남아 있으면 아직 끝난 것이 아니다", () => {
    expect(
      deriveSessionState({ ...coordinating, confirmedAt: fromNow(-1), playMinutes: 360 }, NOW),
    ).toBe(SESSION_STATE.confirmed);
  });

  it("플레이타임만큼 지나면 종료다", () => {
    expect(
      deriveSessionState({ ...coordinating, confirmedAt: fromNow(-4), playMinutes: 180 }, NOW),
    ).toBe(SESSION_STATE.finished);
  });
});
