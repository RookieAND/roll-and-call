import { describe, expect, it } from "vitest";

import { CONFIRMED_LEAVE_BLOCK, confirmedLeaveBlock } from "./confirmed-leave-block";
import { RECRUIT_METHOD } from "./recruit-method";
import { SCHEDULE_MODE } from "./schedule-mode";
import { WAITING_LEAVE_BLOCK, waitingLeaveBlock } from "./waiting-leave-block";

const NOW = new Date("2026-09-14T12:00:00+09:00");
const HOUR = 60 * 60 * 1000;
const fromNow = (hours: number) => new Date(NOW.getTime() + hours * HOUR);

type LeaveGame = Parameters<typeof confirmedLeaveBlock>[0]["game"] &
  Parameters<typeof waitingLeaveBlock>[0]["game"];

const firstCome: LeaveGame = {
  scheduleMode: SCHEDULE_MODE.coordinate,
  confirmedAt: null,
  endDate: fromNow(48),
  drawnAt: null,
  recruitMethod: RECRUIT_METHOD.firstCome,
  maxPlayers: 4,
  playMinutes: 180,
  endedAt: null,
};
const lottery: LeaveGame = { ...firstCome, recruitMethod: RECRUIT_METHOD.lottery };

describe("confirmedLeaveBlock", () => {
  const leave = (game: LeaveGame, { confirmedCount = 2, waitingCount = 0 } = {}) =>
    confirmedLeaveBlock({ game, confirmedCount, waitingCount, now: NOW });

  it("조율형은 일시를 확정하면 막는다", () => {
    expect(leave({ ...firstCome, confirmedAt: fromNow(24) })).toBe(CONFIRMED_LEAVE_BLOCK.schedule);
  });

  it("일시 지정형은 시작 뒤에 막고, 시작 전에는 연다", () => {
    const fixed = { ...firstCome, scheduleMode: SCHEDULE_MODE.fixed };
    expect(leave({ ...fixed, confirmedAt: fromNow(-1) })).toBe(CONFIRMED_LEAVE_BLOCK.schedule);
    expect(leave({ ...fixed, confirmedAt: fromNow(24) })).toBeNull();
  });

  it("추첨 뒤에는 막는다", () => {
    expect(leave({ ...lottery, drawnAt: fromNow(-1) })).toBe(CONFIRMED_LEAVE_BLOCK.drawn);
  });

  it("마감이 지나면 막는다", () => {
    expect(leave({ ...firstCome, endDate: fromNow(-1) })).toBe(CONFIRMED_LEAVE_BLOCK.expired);
  });

  it("선착순 정원 참이고 대기자가 없으면 막는다", () => {
    expect(leave(firstCome, { confirmedCount: 4, waitingCount: 0 })).toBe(
      CONFIRMED_LEAVE_BLOCK.full,
    );
  });

  it("정원이 찼어도 대기자가 있으면 취소할 수 있다", () => {
    expect(leave(firstCome, { confirmedCount: 4, waitingCount: 1 })).toBeNull();
  });

  it("추첨 글 직접 확정자는 마감 전이면 정원이 차도 취소할 수 있다", () => {
    expect(leave(lottery, { confirmedCount: 4, waitingCount: 0 })).toBeNull();
  });
});

describe("waitingLeaveBlock", () => {
  it("추첨 신청자는 마감 전 취소하고 마감 뒤 막는다", () => {
    expect(waitingLeaveBlock({ game: lottery, now: NOW })).toBeNull();
    expect(waitingLeaveBlock({ game: { ...lottery, endDate: fromNow(-1) }, now: NOW })).toBe(
      WAITING_LEAVE_BLOCK.closed,
    );
  });

  it("선착순 대기자는 세션이 끝나기 전까지 취소한다", () => {
    const scheduled = { ...firstCome, confirmedAt: fromNow(-1), endDate: fromNow(-2) };
    expect(waitingLeaveBlock({ game: scheduled, now: NOW })).toBeNull();
    expect(waitingLeaveBlock({ game: { ...scheduled, confirmedAt: fromNow(-4) }, now: NOW })).toBe(
      WAITING_LEAVE_BLOCK.ended,
    );
  });

  it("GM이 세션을 마쳤으면 실제 종료 시각으로 본다", () => {
    const ended = { ...firstCome, confirmedAt: fromNow(-1), endedAt: fromNow(-0.5) };
    expect(waitingLeaveBlock({ game: ended, now: NOW })).toBe(WAITING_LEAVE_BLOCK.ended);
  });

  it("추첨 결과 대기자는 마감이 지나도 세션이 끝나기 전까지 취소한다", () => {
    const drawn = { ...lottery, drawnAt: fromNow(-3), endDate: fromNow(-3) };
    expect(waitingLeaveBlock({ game: drawn, now: NOW })).toBeNull();
  });
});
