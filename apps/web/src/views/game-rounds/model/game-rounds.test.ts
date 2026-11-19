import { describe, expect, it } from "vitest";

import { ROUND_ROW_KIND } from "./round-row-kind";
import { roundRowViews } from "./round-row-views";
import { roundsSummary } from "./rounds-summary";
import { staleNotice } from "./stale-notice";

const HOUR = 3_600_000;
const DAY = 24 * HOUR;
const BASE = new Date("2026-12-05T03:00:00Z").getTime();
const now = new Date(BASE + 7 * DAY + HOUR);

function dated(roundNo: number, weeks: number, extra: { endedAt?: Date } = {}) {
  return {
    roundNo,
    status: "scheduled" as const,
    startAt: new Date(BASE + weeks * 7 * DAY),
    plannedEndAt: new Date(BASE + weeks * 7 * DAY + 4 * HOUR),
    endedAt: extra.endedAt ?? null,
    attendanceConfirmedAt: null,
    coordinationStart: null,
    coordinationEnd: null,
  };
}

function pending(roundNo: number) {
  return {
    roundNo,
    status: "unscheduled" as const,
    startAt: null,
    plannedEndAt: null,
    endedAt: null,
    attendanceConfirmedAt: null,
    coordinationStart: null,
    coordinationEnd: null,
  };
}

describe("회차 줄", () => {
  it("끝남·일찍 마침·진행 중·정해짐을 문장으로 나눈다", () => {
    const rounds = [dated(1, 0, { endedAt: new Date(BASE + 3 * HOUR) }), dated(2, 1), dated(3, 2)];
    const views = roundRowViews({ rounds, now });
    expect(views.map((view) => view.kind)).toEqual([
      ROUND_ROW_KIND.finished,
      ROUND_ROW_KIND.inProgress,
      ROUND_ROW_KIND.scheduled,
    ]);
    expect(views[0]!.note).toBe("일찍 마침");
    expect(views[1]!.label).toBe("2회차 · 지금 진행 중입니다");
    expect(views[2]!.attendanceRoundNo).toBeNull();
  });

  it("일정 없는 회차는 가장 앞 하나만 보이고 나머지는 한 줄로 묶는다", () => {
    const views = roundRowViews({ rounds: [dated(1, 0), pending(2), pending(3), pending(4)], now });
    expect(views.map((view) => view.label)).toEqual([
      expect.stringMatching(/^1회차 · /),
      "2회차 · 아직 정하지 않았습니다",
      "3~4회차 · 앞 회차를 잡은 뒤 정합니다",
    ]);
  });
});

describe("일정 잡기 링크", () => {
  it("미정 회차는 잡을 수 있을 때, 정해진 회차는 옮길 수 있을 때 회차 번호를 붙인다", () => {
    const rounds = [dated(1, 0), dated(2, 2), pending(3)];
    const both = roundRowViews({ rounds, now, canSchedule: true, canMove: true });
    expect(both.map((view) => view.scheduleRoundNo)).toEqual([null, 2, 3]);
    const designated = roundRowViews({ rounds, now, canMove: true });
    expect(designated.map((view) => view.scheduleRoundNo)).toEqual([null, 2, null]);
    const off = roundRowViews({ rounds, now });
    expect(off.every((view) => view.scheduleRoundNo === null)).toBe(true);
  });
});

describe("요약", () => {
  const game = {
    roundCount: 6,
    roundScheduleKind: "coordinated" as const,
    repeatRule: null,
    confirmedAt: new Date(BASE),
    rangeStart: null,
    rangeEnd: null,
    finishedAt: null,
    incompleteAt: null,
  };

  it("마친 회차까지와 진행 방식을 보인다", () => {
    expect(roundsSummary({ game, rounds: [dated(1, 0), dated(2, 1)], now })).toEqual({
      title: "총 6회 · 1회차까지 마쳤습니다",
      sub: "조율형 · 한 회차씩 정합니다",
    });
  });

  it("조기 종결이면 마친 회차를 말한다", () => {
    const finished = { ...game, finishedAt: now, incompleteAt: now };
    expect(roundsSummary({ game: finished, rounds: [dated(1, 0)], now }).title).toBe(
      "총 6회 · 1회차에서 마쳤습니다",
    );
  });
});

describe("자동 종결 안내", () => {
  it("7일 이하로 남으면 남은 날을 경고로 보인다", () => {
    const rounds = [dated(1, 0), pending(2)];
    const lastEnd = BASE + 4 * HOUR;
    expect(staleNotice({ rounds, now: new Date(lastEnd + 10 * DAY) })?.warning).toBe(false);
    expect(staleNotice({ rounds, now: new Date(lastEnd + 26 * DAY) })).toEqual({
      text: "4일 뒤 자동으로 마칩니다.",
      warning: true,
    });
  });

  it("남은 회차 일정이 모두 정해졌으면 안내가 없다", () => {
    expect(staleNotice({ rounds: [dated(1, 0), dated(2, 1)], now })).toBeNull();
  });
});
