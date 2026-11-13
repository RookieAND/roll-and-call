import { describe, expect, it } from "vitest";

import { buildNewRounds } from "./build-new-rounds";
import { buildRepeatRounds } from "./build-repeat-rounds";
import { repeatRuleOf } from "./repeat-rule-of";
import { ROUND_SCHEDULE_ERROR, roundScheduleError } from "./round-schedule-error";

const HOUR = 3_600_000;
// 2026-12-26(토) 오후 12:00~4:00 KST
const first = {
  startsAt: new Date("2026-12-26T03:00:00Z"),
  endsAt: new Date("2026-12-26T07:00:00Z"),
};
const kstDate = (date: Date) => new Date(date.getTime() + 9 * HOUR).toISOString().slice(0, 10);

describe("buildRepeatRounds", () => {
  it("매주 반복은 연말을 넘겨도 같은 요일·시각이다", () => {
    const rounds = buildRepeatRounds({ first, intervalWeeks: 1, count: 4 });
    expect(rounds.map((round) => kstDate(round.startsAt))).toEqual([
      "2026-12-26",
      "2027-01-02",
      "2027-01-09",
      "2027-01-16",
    ]);
    expect(rounds[3]!.endsAt.getTime() - rounds[3]!.startsAt.getTime()).toBe(4 * HOUR);
  });

  it("격주 반복은 월말을 넘긴다", () => {
    const rounds = buildRepeatRounds({
      first: {
        startsAt: new Date("2026-01-24T03:00:00Z"),
        endsAt: new Date("2026-01-24T07:00:00Z"),
      },
      intervalWeeks: 2,
      count: 3,
    });
    expect(rounds.map((round) => kstDate(round.startsAt))).toEqual([
      "2026-01-24",
      "2026-02-07",
      "2026-02-21",
    ]);
  });
});

describe("repeatRuleOf", () => {
  it("요일과 시각은 1회차의 한국 시각을 따른다", () => {
    expect(repeatRuleOf({ first, intervalWeeks: 2 })).toEqual({
      weekday: 6,
      startTime: "12:00",
      endTime: "16:00",
      intervalWeeks: 2,
    });
  });

  it("자정을 넘는 종료도 한국 시각으로 적는다", () => {
    const rule = repeatRuleOf({
      first: {
        startsAt: new Date("2026-12-26T12:00:00Z"),
        endsAt: new Date("2026-12-26T16:30:00Z"),
      },
      intervalWeeks: 1,
    });
    expect(rule).toMatchObject({ weekday: 6, startTime: "21:00", endTime: "01:30" });
  });
});

describe("roundScheduleError", () => {
  const designated = (rounds: { startsAt: Date; endsAt: Date }[], roundCount = rounds.length) =>
    roundScheduleError({ roundCount, scheduleKind: "designated", isBriefing: false, rounds });
  const week = buildRepeatRounds({ first, intervalWeeks: 1, count: 3 });

  it("올바른 입력은 통과한다", () => {
    expect(designated(week)).toBeNull();
  });

  it("예정 회차 수 범위 밖, 설명회, 행 수 불일치를 거른다", () => {
    expect(designated(week, 1)?.code).toBe(ROUND_SCHEDULE_ERROR.countRange);
    expect(designated(week, 53)?.code).toBe(ROUND_SCHEDULE_ERROR.countRange);
    expect(
      roundScheduleError({
        roundCount: 3,
        scheduleKind: "designated",
        isBriefing: true,
        rounds: week,
      })?.code,
    ).toBe(ROUND_SCHEDULE_ERROR.briefing);
    expect(designated(week, 4)?.code).toBe(ROUND_SCHEDULE_ERROR.countMismatch);
  });

  it("종료가 시작보다 앞서거나 24시간을 넘거나 겹치면 거른다", () => {
    const bad = (round: { startsAt: Date; endsAt: Date }) => designated([round, ...week.slice(1)]);
    expect(bad({ startsAt: first.endsAt, endsAt: first.startsAt })?.code).toBe(
      ROUND_SCHEDULE_ERROR.endBeforeStart,
    );
    expect(
      bad({ startsAt: first.startsAt, endsAt: new Date(first.startsAt.getTime() + 25 * HOUR) })
        ?.code,
    ).toBe(ROUND_SCHEDULE_ERROR.tooLong);
    expect(
      designated([
        week[0]!,
        { ...week[0]!, startsAt: new Date(first.startsAt.getTime() + HOUR) },
        week[2]!,
      ])?.code,
    ).toBe(ROUND_SCHEDULE_ERROR.overlap);
  });

  it("24시간 정확히와 맞닿는 회차는 허용한다", () => {
    const longRound = {
      startsAt: first.startsAt,
      endsAt: new Date(first.startsAt.getTime() + 24 * HOUR),
    };
    const next = {
      startsAt: longRound.endsAt,
      endsAt: new Date(longRound.endsAt.getTime() + HOUR),
    };
    expect(designated([longRound, next])).toBeNull();
  });

  it("조율형은 1회차 일정까지만 받는다", () => {
    const coordinated = (rounds: { startsAt: Date; endsAt: Date }[]) =>
      roundScheduleError({ roundCount: 6, scheduleKind: "coordinated", isBriefing: false, rounds });
    expect(coordinated([])).toBeNull();
    expect(coordinated([week[0]!])).toBeNull();
    expect(coordinated(week)?.code).toBe(ROUND_SCHEDULE_ERROR.tooManyDated);
  });
});

describe("buildNewRounds", () => {
  it("지정형은 넘긴 일시마다 정해진 회차를 만든다", () => {
    const rows = buildNewRounds({
      scheduleKind: "designated",
      roundCount: 2,
      dated: buildRepeatRounds({ first, intervalWeeks: 1, count: 2 }),
    });
    expect(rows.map((row) => [row.roundNo, row.status])).toEqual([
      [1, "scheduled"],
      [2, "scheduled"],
    ]);
  });

  it("조율형 1회차 범위 조율은 조율 중 회차와 일정 없는 회차를 만든다", () => {
    const rows = buildNewRounds({
      scheduleKind: "coordinated",
      roundCount: 4,
      dated: [],
      firstRoundCoordination: { start: "2026-12-01", end: "2026-12-07", timezone: "Asia/Seoul" },
    });
    expect(rows.map((row) => [row.roundNo, row.status])).toEqual([
      [1, "coordinating"],
      [2, "unscheduled"],
      [3, "unscheduled"],
      [4, "unscheduled"],
    ]);
    expect(rows[0]).toMatchObject({ coordinationStart: "2026-12-01" });
  });
});
