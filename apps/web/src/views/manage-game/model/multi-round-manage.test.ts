import { describe, expect, it } from "vitest";

import { MANAGE_ROW_STATE } from "./manage-row-state";
import { multiRoundProgressRows } from "./multi-round-progress-rows";
import { multiRoundStage } from "./multi-round-stage";

const HOUR = 3_600_000;
const WEEK = 7 * 24 * HOUR;
const BASE = new Date("2026-12-05T03:00:00Z").getTime();

function dated(roundNo: number) {
  const start = BASE + (roundNo - 1) * WEEK;
  return {
    roundNo,
    status: "scheduled" as const,
    startAt: new Date(start),
    plannedEndAt: new Date(start + 4 * HOUR),
    endedAt: null,
    attendanceConfirmedAt: null,
    coordinationStart: null,
    coordinationEnd: null,
    coordinationWindowStartHour: null,
    coordinationWindowEndHour: null,
  };
}

const pending = {
  ...dated(3),
  status: "unscheduled" as const,
  startAt: null,
  plannedEndAt: null,
};

const game = {
  id: "g1",
  roundCount: 3,
  roundScheduleKind: "designated",
  finishedAt: null,
  cancelledAt: null,
};

describe("다회차 단계 배지", () => {
  it("회차 진행 중이면 번호를, 회차 사이면 다음 회차 대기를 보인다", () => {
    const rounds = [dated(1), dated(2), dated(3)];
    expect(multiRoundStage({ game, rounds, now: new Date(BASE + WEEK + HOUR) })?.label).toBe(
      "2/3회차 진행 중",
    );
    expect(multiRoundStage({ game, rounds, now: new Date(BASE + 5 * HOUR) })).toEqual({
      label: "다음 회차 대기",
      tone: "gray",
      note: null,
    });
  });

  it("조율형이고 다음 회차 일정이 없으면 일정을 잡아 달라고 한다", () => {
    const coordinated = { ...game, roundScheduleKind: "coordinated" };
    const rounds = [dated(1), dated(2), pending];
    expect(
      multiRoundStage({ game: coordinated, rounds, now: new Date(BASE + WEEK + 5 * HOUR) })?.note,
    ).toBe("다음 회차 일정을 잡아 주세요.");
  });

  it("1회차 전이나 끝난 구인은 단발 단계를 쓴다", () => {
    const rounds = [dated(1), dated(2)];
    expect(multiRoundStage({ game, rounds, now: new Date(BASE - HOUR) })).toBeNull();
    expect(
      multiRoundStage({
        game: { ...game, finishedAt: new Date(BASE) },
        rounds,
        now: new Date(BASE + HOUR),
      }),
    ).toBeNull();
  });
});

describe("다회차 세션 진행 줄", () => {
  it("진행 중인 회차를 마치고 그 회차 출석으로 간다", () => {
    const [schedule, attendance, end] = multiRoundProgressRows({
      game,
      rounds: [dated(1), dated(2), dated(3)],
      now: new Date(BASE + WEEK + HOUR),
    });
    expect(schedule!.detail).toBe("3/3회");
    expect(attendance).toMatchObject({
      label: "2회차 출석 확인",
      href: "/games/g1/attendance?round=2",
      state: MANAGE_ROW_STATE.open,
    });
    expect(end).toMatchObject({ label: "2회차 마치기", round: { roundNo: 2, lastRound: false } });
  });

  it("조율형이고 다음 회차가 없으면 가장 앞 미정 회차의 일정 잡기 버튼을 둔다", () => {
    const coordinated = { ...game, roundScheduleKind: "coordinated" };
    const now = new Date(BASE + WEEK + 5 * HOUR);
    const rounds = [dated(1), dated(2), pending];
    expect(multiRoundProgressRows({ game: coordinated, rounds, now })[0]!.extraAction).toEqual({
      label: "3회차 일정 잡기",
      href: "/games/g1/rounds/3/schedule",
    });
    expect(multiRoundProgressRows({ game, rounds, now })[0]!.extraAction).toBeUndefined();
    expect(
      multiRoundProgressRows({ game: { ...coordinated, finishedAt: now }, rounds, now })[0]!
        .extraAction,
    ).toBeUndefined();
  });

  it("회차 사이에는 마치기가 잠긴다", () => {
    const rows = multiRoundProgressRows({
      game,
      rounds: [dated(1), dated(2), dated(3)],
      now: new Date(BASE + 5 * HOUR),
    });
    expect(rows[2]!.state).toBe(MANAGE_ROW_STATE.locked);
  });
});
