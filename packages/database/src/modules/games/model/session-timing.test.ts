import { describe, expect, it } from "vitest";

import {
  effectivePlayMinutes,
  isApplicationClosed,
  isSessionEnded,
  isSessionInProgress,
  isSessionStarted,
  plannedEndAt,
  sessionEndAt,
} from "./session-timing";

const now = new Date("2026-09-14T00:00:00Z");
const future = new Date("2026-09-20T11:00:00Z");
const past = new Date("2026-09-10T11:00:00Z");
const MINUTE = 60_000;
const at = (minutes: number) => new Date(now.getTime() + minutes * MINUTE);

describe("isApplicationClosed", () => {
  it("조율형은 시간이 정해지기 전까지 열려 있다", () => {
    expect(isApplicationClosed({ scheduleMode: "coordinate", confirmedAt: null }, now)).toBe(false);
  });

  it("조율형은 GM이 확정하는 순간 닫힌다", () => {
    expect(isApplicationClosed({ scheduleMode: "coordinate", confirmedAt: future }, now)).toBe(
      true,
    );
  });

  it("일시 지정형은 세션 시각이 있어도 시작 전엔 열려 있다", () => {
    expect(isApplicationClosed({ scheduleMode: "fixed", confirmedAt: future }, now)).toBe(false);
  });

  it("일시 지정형은 세션이 시작하면 닫힌다", () => {
    expect(isApplicationClosed({ scheduleMode: "fixed", confirmedAt: past }, now)).toBe(true);
  });
});

describe("isSessionStarted", () => {
  it("시각이 없으면 시작하지 않았다", () => {
    expect(isSessionStarted({ confirmedAt: null }, now)).toBe(false);
  });

  it("시작 직전에는 시작하지 않았다", () => {
    expect(isSessionStarted({ confirmedAt: at(0.001) }, now)).toBe(false);
  });

  it("시작 시각부터 시작했다", () => {
    expect(isSessionStarted({ confirmedAt: now }, now)).toBe(true);
    expect(isSessionStarted({ confirmedAt: at(-1).toISOString() }, now)).toBe(true);
  });
});

describe("sessionEndAt", () => {
  it("마친 시각이 있으면 그 시각이다", () => {
    expect(sessionEndAt({ confirmedAt: at(-60), playMinutes: 240, endedAt: at(-10) })).toEqual(
      at(-10),
    );
  });

  it("마친 시각이 없으면 시작 + 플레이타임이다", () => {
    expect(sessionEndAt({ confirmedAt: at(0), playMinutes: 120, endedAt: null })).toEqual(at(120));
  });

  it("플레이타임이 없으면 180분이다", () => {
    expect(sessionEndAt({ confirmedAt: at(0), playMinutes: null, endedAt: null })).toEqual(at(180));
    expect(effectivePlayMinutes(0)).toBe(180);
  });

  it("시작 시각이 없으면 종료도 없다", () => {
    expect(sessionEndAt({ confirmedAt: null, playMinutes: 120, endedAt: null })).toBeNull();
    expect(plannedEndAt({ confirmedAt: null, playMinutes: 120 })).toBeNull();
  });

  it("예정 종료는 마친 시각을 보지 않는다", () => {
    expect(plannedEndAt({ confirmedAt: at(-60), playMinutes: 240 })).toEqual(at(180));
  });
});

describe("isSessionEnded·isSessionInProgress", () => {
  const game = { confirmedAt: at(-120), playMinutes: 120, endedAt: null };

  it("종료 직전은 진행 중이다", () => {
    const beforeEnd = { ...game, confirmedAt: at(-119.999) };
    expect(isSessionEnded(beforeEnd, now)).toBe(false);
    expect(isSessionInProgress(beforeEnd, now)).toBe(true);
  });

  it("종료 시각부터 끝났다", () => {
    expect(isSessionEnded(game, now)).toBe(true);
    expect(isSessionInProgress(game, now)).toBe(false);
  });

  it("마친 시각이 지나면 예정 종료 전이어도 끝났다", () => {
    const finished = { confirmedAt: at(-30), playMinutes: 240, endedAt: now };
    expect(isSessionEnded(finished, now)).toBe(true);
    expect(isSessionInProgress(finished, now)).toBe(false);
  });

  it("시작 전은 진행 중도 종료도 아니다", () => {
    const upcoming = { ...game, confirmedAt: at(1) };
    expect(isSessionEnded(upcoming, now)).toBe(false);
    expect(isSessionInProgress(upcoming, now)).toBe(false);
  });

  it("시각이 없으면 끝나지 않았다", () => {
    expect(isSessionEnded({ ...game, confirmedAt: null }, now)).toBe(false);
  });
});
