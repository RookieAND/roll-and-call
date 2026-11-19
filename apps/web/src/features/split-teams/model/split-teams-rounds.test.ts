import { describe, expect, it } from "vitest";

import { splitTeamsRounds } from "./split-teams-rounds";
import type { SplitTeamsScheduleColumns } from "./split-teams-schedule";

const HOUR = 3_600_000;
const WEEK = 7 * 24 * HOUR;
// 2026-11-21(토) 12:00~16:00 KST
const start = new Date("2026-11-21T03:00:00Z");
const end = new Date("2026-11-21T07:00:00Z");

const fixed: SplitTeamsScheduleColumns = {
  scheduleMode: "fixed",
  rangeStart: null,
  rangeEnd: null,
  windowStartHour: 18,
  windowEndHour: 24,
  confirmedAt: start,
};
const weekly = { weekday: 6, startTime: "12:00", endTime: "16:00", intervalWeeks: 1 };

describe("splitTeamsRounds", () => {
  it("단발은 건드리지 않는다", () => {
    const game = { roundCount: 1, roundScheduleKind: "designated" as const, repeatRule: null };
    expect(splitTeamsRounds({ game, originals: [], schedule: fixed })).toBeNull();
  });

  it("지정형은 새 1회차에서 매주 회차를 만들고 반복 규칙을 이어받는다", () => {
    const game = { roundCount: 3, roundScheduleKind: "designated" as const, repeatRule: weekly };
    const result = splitTeamsRounds({
      game,
      originals: [],
      schedule: fixed,
      firstRoundEndsAt: end,
    });
    expect(result).toMatchObject({ repeatRule: weekly });
    const { rows } = result as Exclude<typeof result, null | { error: string }>;
    expect(rows.map((row) => row.startAt?.getTime())).toEqual([
      start.getTime(),
      start.getTime() + WEEK,
      start.getTime() + 2 * WEEK,
    ]);
    expect(rows.every((row) => row.status === "scheduled")).toBe(true);
  });

  it("반복 규칙이 없으면 원 회차의 간격과 길이를 옮긴다", () => {
    const base = new Date("2026-10-01T03:00:00Z");
    const originals = [
      { startAt: base, plannedEndAt: new Date(base.getTime() + 4 * HOUR) },
      {
        startAt: new Date(base.getTime() + 3 * 24 * HOUR),
        plannedEndAt: new Date(base.getTime() + 3 * 24 * HOUR + 2 * HOUR),
      },
    ];
    const game = { roundCount: 2, roundScheduleKind: "designated" as const, repeatRule: null };
    const result = splitTeamsRounds({ game, originals, schedule: fixed, firstRoundEndsAt: end });
    const { rows, repeatRule } = result as Exclude<typeof result, null | { error: string }>;
    expect(repeatRule).toBeNull();
    expect(rows[1]!.startAt!.getTime()).toBe(start.getTime() + 3 * 24 * HOUR);
    expect(rows[1]!.plannedEndAt!.getTime() - rows[1]!.startAt!.getTime()).toBe(2 * HOUR);
  });

  it("지정형은 1회차 종료가 없으면 거부한다", () => {
    const game = { roundCount: 2, roundScheduleKind: "designated" as const, repeatRule: weekly };
    expect(splitTeamsRounds({ game, originals: [], schedule: fixed })).toHaveProperty("error");
  });

  it("조율형은 1회차만 정하고 나머지는 일시 없이 만든다", () => {
    const game = { roundCount: 3, roundScheduleKind: "coordinated" as const, repeatRule: null };
    const result = splitTeamsRounds({
      game,
      originals: [],
      schedule: fixed,
      firstRoundEndsAt: end,
    });
    const { rows, dated } = result as Exclude<typeof result, null | { error: string }>;
    expect(rows.map((row) => row.status)).toEqual(["scheduled", "unscheduled", "unscheduled"]);
    expect(dated).toHaveLength(1);
  });

  it("조율형이 조율 기간을 고르면 1회차는 조율 중이다", () => {
    const game = { roundCount: 2, roundScheduleKind: "coordinated" as const, repeatRule: null };
    const result = splitTeamsRounds({
      game,
      originals: [],
      schedule: {
        ...fixed,
        scheduleMode: "coordinate",
        confirmedAt: null,
        rangeStart: "2026-11-20",
        rangeEnd: "2026-11-25",
      },
    });
    const { rows } = result as Exclude<typeof result, null | { error: string }>;
    expect(rows[0]).toMatchObject({ status: "coordinating", coordinationStart: "2026-11-20" });
  });
});
