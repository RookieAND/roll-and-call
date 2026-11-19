import { describe, expect, it } from "vitest";

import { manageRoundProgress } from "./manage-round-progress";
import { MANAGE_ROW_STATE } from "./manage-row-state";
import { multiRoundProgressRows } from "./multi-round-progress-rows";
import { multiRoundStage } from "./multi-round-stage";
import { multiRoundStats } from "./multi-round-stats";
import { multiRoundTimeline } from "./multi-round-timeline";
import { nextScheduleAction } from "./next-schedule-action";

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
    expect(schedule!.label).toBe("회차 일정");
    expect(schedule!.detail).toBe("회차별 일정을 확인하고 바꿉니다");
    expect(attendance).toMatchObject({
      label: "2회차 출석 확인",
      href: "/games/g1/attendance?round=2",
      state: MANAGE_ROW_STATE.open,
    });
    expect(end).toMatchObject({ label: "2회차 마치기", round: { roundNo: 2, lastRound: false } });
  });

  it("조율형이고 다음 회차가 없으면 가장 앞 미정 회차의 일정 잡기 행동을 준다", () => {
    const coordinated = { ...game, roundScheduleKind: "coordinated" };
    const now = new Date(BASE + WEEK + 5 * HOUR);
    const rounds = [dated(1), dated(2), pending];
    expect(nextScheduleAction({ game: coordinated, rounds, now })).toEqual({
      label: "3회차 일정 잡기",
      href: "/games/g1/rounds/3/schedule",
    });
    expect(nextScheduleAction({ game, rounds, now })).toBeNull();
    expect(
      nextScheduleAction({ game: { ...coordinated, finishedAt: now }, rounds, now }),
    ).toBeNull();
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

describe("다회차 진행 표시", () => {
  const rounds = [dated(1), dated(2), dated(3), { ...pending, roundNo: 4 }];

  it("회차마다 끝남·진행 중·남음으로 나눈다", () => {
    const steps = multiRoundTimeline({ rounds, now: new Date(BASE + WEEK + HOUR) });
    expect(steps.map((step) => [step.name, step.state])).toEqual([
      ["1회차", "done"],
      ["2회차", "current"],
      ["3회차", "todo"],
      ["4회차", "todo"],
    ]);
    expect(steps[3]!.detail).toBe("일정을 아직 정하지 않았습니다");
  });

  it("회차가 많으면 지난 회차와 먼 회차를 한 줄로 줄인다", () => {
    const many = Array.from({ length: 10 }, (_, index) => dated(index + 1));
    const steps = multiRoundTimeline({ rounds: many, now: new Date(BASE + 3 * WEEK + HOUR) });
    expect(steps.map((step) => [step.name, step.state])).toEqual([
      ["1~3회차", "done"],
      ["4회차", "current"],
      ["5회차", "todo"],
      ["6회차", "todo"],
      ["7~10회차", "todo"],
    ]);
    expect(steps[0]!.detail).toBe("3회 마쳤습니다");
    expect(steps[4]!.detail).toBe("4회 남았습니다");
  });

  it("마친 회차 수를 세고 조기 종결이면 마친 회차에서 멈춘다", () => {
    const now = new Date(BASE + WEEK + 5 * HOUR);
    const open = { roundCount: 4, finishedAt: null, incompleteAt: null };
    expect(manageRoundProgress({ game: open, rounds, now })).toEqual({
      done: 2,
      total: 4,
      early: false,
    });
    const early = { roundCount: 4, finishedAt: now, incompleteAt: now };
    expect(manageRoundProgress({ game: early, rounds, now })).toEqual({
      done: 2,
      total: 4,
      early: true,
    });
  });
});

describe("다회차 요약 통계", () => {
  it("세션 일시 대신 다음 회차 일시를 보이고 확정 인원은 남긴다", () => {
    const stats = [
      { label: "세션 일시", value: "12월 5일 (토) 12:00" },
      { label: "확정 인원", value: "4 / 5명" },
      { label: "대기", value: "1명" },
    ];
    const rounds = [dated(1), dated(2), dated(3)];
    const result = multiRoundStats({ stats, rounds, now: new Date(BASE + HOUR) });
    expect(result.map((stat) => stat.label)).toEqual(["다음 회차", "확정 인원", "대기"]);
    expect(result[0]!.value).toContain("12월 12일");
  });

  it("남은 회차가 없으면 미정이다", () => {
    const result = multiRoundStats({ stats: [], rounds: [dated(1)], now: new Date(BASE + WEEK) });
    expect(result[0]!.value).toBe("미정");
  });
});
