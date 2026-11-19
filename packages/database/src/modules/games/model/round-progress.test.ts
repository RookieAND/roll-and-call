import { describe, expect, it } from "vitest";

import { isFinisher } from "./is-finisher";
import { isRoundOpen } from "./is-round-open";
import { isStaleCoordinatedGame } from "./is-stale-coordinated-game";
import { roundCountChange } from "./round-count-change";
import { roundSkipBlock } from "./round-skip-block";

const HOUR = 3_600_000;
const DAY = 24 * HOUR;
const START = new Date("2026-12-05T10:00:00Z");
const round = {
  startAt: START,
  plannedEndAt: new Date(START.getTime() + 4 * HOUR),
  endedAt: null,
};
const at = (ms: number) => new Date(START.getTime() + ms);

describe("회차 열림", () => {
  it("시작부터 종료 24시간 전까지 열리고 마친 시각이 있으면 그 시각을 기준으로 한다", () => {
    expect(isRoundOpen({ round, now: at(-1) })).toBe(false);
    expect(isRoundOpen({ round, now: at(0) })).toBe(true);
    expect(isRoundOpen({ round, now: at(28 * HOUR - 1) })).toBe(true);
    expect(isRoundOpen({ round, now: at(28 * HOUR) })).toBe(false);
    const ended = { ...round, endedAt: at(HOUR) };
    expect(isRoundOpen({ round: ended, now: at(25 * HOUR) })).toBe(false);
  });

  it("일시가 없는 회차는 열리지 않는다", () => {
    const unscheduled = { startAt: null, plannedEndAt: null, endedAt: null };
    expect(isRoundOpen({ round: unscheduled, now: at(0) })).toBe(false);
  });
});

describe("회차 생략 막기", () => {
  const game = {
    roundCount: 3,
    roundScheduleKind: "designated" as const,
    finishedAt: null,
    cancelledAt: null,
  };

  it("열린 회차만 생략하고 지정형은 2회 아래로 줄이지 않는다", () => {
    expect(roundSkipBlock({ game, round, now: at(HOUR) })).toBeNull();
    expect(roundSkipBlock({ game, round, now: at(-HOUR) })).toBe("closed");
    expect(roundSkipBlock({ game: { ...game, roundCount: 2 }, round, now: at(HOUR) })).toBe(
      "too_few_rounds",
    );
    const coordinated = { ...game, roundCount: 2, roundScheduleKind: "coordinated" as const };
    expect(roundSkipBlock({ game: coordinated, round, now: at(HOUR) })).toBeNull();
  });

  it("끝난 구인은 생략하지 않는다", () => {
    expect(roundSkipBlock({ game: { ...game, finishedAt: at(0) }, round, now: at(HOUR) })).toBe(
      "finished_game",
    );
  });
});

describe("조율형 30일 자동 종결", () => {
  const finished = { startAt: START, plannedEndAt: at(4 * HOUR), endedAt: null };
  const pending = { startAt: null, plannedEndAt: null, endedAt: null };
  const lastEnd = 4 * HOUR;

  it("마지막 종료 뒤 29일은 기다리고 30일이 되면 마친다", () => {
    const rounds = [finished, pending];
    expect(isStaleCoordinatedGame({ rounds, now: at(lastEnd + 29 * DAY) })).toBe(false);
    expect(isStaleCoordinatedGame({ rounds, now: at(lastEnd + 30 * DAY - 1) })).toBe(false);
    expect(isStaleCoordinatedGame({ rounds, now: at(lastEnd + 30 * DAY) })).toBe(true);
  });

  it("1회차 조율 중이거나 남은 회차 일시가 모두 정해졌으면 마치지 않는다", () => {
    expect(isStaleCoordinatedGame({ rounds: [pending, pending], now: at(60 * DAY) })).toBe(false);
    expect(isStaleCoordinatedGame({ rounds: [finished], now: at(60 * DAY) })).toBe(false);
  });

  it("다음 회차가 정해져 아직 끝나지 않았으면 기다린다", () => {
    const upcoming = { startAt: at(40 * DAY), plannedEndAt: at(40 * DAY + HOUR), endedAt: null };
    const rounds = [finished, upcoming, pending];
    expect(isStaleCoordinatedGame({ rounds, now: at(35 * DAY) })).toBe(false);
  });
});

describe("완주", () => {
  const game = { finishedAt: at(0), cancelledAt: null };
  const stayed = { status: "confirmed" as const, lateJoined: false, leftReason: null };

  it("빠진 회차가 있어도 끝까지 남으면 완주다", () => {
    expect(isFinisher({ game, participant: stayed })).toBe(true);
  });

  it("합의 하차·내보내기·중도 합류는 완주가 아니다", () => {
    expect(
      isFinisher({ game, participant: { ...stayed, status: "removed", leftReason: "mutual" } }),
    ).toBe(false);
    expect(
      isFinisher({ game, participant: { ...stayed, status: "removed", leftReason: "removed" } }),
    ).toBe(false);
    expect(isFinisher({ game, participant: { ...stayed, lateJoined: true } })).toBe(false);
  });

  it("끝나지 않았거나 취소한 구인은 완주가 없다", () => {
    expect(isFinisher({ game: { ...game, finishedAt: null }, participant: stayed })).toBe(false);
    expect(isFinisher({ game: { ...game, cancelledAt: at(0) }, participant: stayed })).toBe(false);
  });
});

describe("예정 회차 수 바꾸기", () => {
  it("시작한 회차 수보다 적게는 못 줄이고 같게 줄이면 조기 종결이다", () => {
    expect(roundCountChange({ current: 5, next: 2, startedCount: 3 })).toBe("invalid");
    expect(roundCountChange({ current: 5, next: 3, startedCount: 3 })).toBe("finish");
    expect(roundCountChange({ current: 5, next: 4, startedCount: 3 })).toBe("set");
    expect(roundCountChange({ current: 5, next: 5, startedCount: 3 })).toBe("same");
    expect(roundCountChange({ current: 5, next: 53, startedCount: 3 })).toBe("invalid");
  });
});
