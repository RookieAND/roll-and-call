import { describe, expect, it } from "vitest";

import {
  GAME_CANCEL_KIND,
  PARTICIPANT_STATUS,
  RECRUIT_METHOD,
  SCHEDULE_MODE,
} from "@/entities/game";
import type { GameDetailData } from "@/shared/server";

import { cancelRowLock } from "./cancel-row-lock";
import { MANAGE_ROW_ACTION, MANAGE_ROW_STATE } from "./manage-row-state";
import { manageRows } from "./manage-rows";

const NOW = new Date("2026-09-20T12:00:00+09:00");
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const at = (milliseconds: number) => new Date(NOW.getTime() + milliseconds);

const member = (userId: string, status: string = PARTICIPANT_STATUS.confirmed) => ({
  userId,
  joinedAt: NOW,
  status,
  absent: false,
  absenceCancelledAt: null,
});

const coordinating = {
  id: "game",
  scheduleMode: SCHEDULE_MODE.coordinate,
  recruitMethod: RECRUIT_METHOD.firstCome,
  drawnAt: null,
  cancelledAt: null,
  confirmedAt: null,
  playMinutes: 60,
  endedAt: null,
  attendanceConfirmedAt: null,
  attendanceFirstConfirmedAt: null,
  endDate: at(2 * DAY),
  maxPlayers: 4,
  participants: ["a", "b", "c", "d"].map((userId) => member(userId)),
} as unknown as GameDetailData;

const gameWith = (patch: Record<string, unknown>) =>
  ({ ...coordinating, ...patch }) as unknown as GameDetailData;

const byKey = (game: GameDetailData) => {
  const [attendance, review, time, roster, edit] = manageRows({ game, reviewCount: 0, now: NOW });
  return { attendance: attendance!, review: review!, time: time!, roster: roster!, edit: edit! };
};

describe("manageRows", () => {
  it("줄 순서는 늘 같다", () => {
    expect(
      manageRows({ game: coordinating, reviewCount: 0, now: NOW }).map((row) => row.key),
    ).toEqual(["attendance", "review", "time", "roster", "edit"]);
  });

  it("조율 중에는 출석 확인을 잠그고 시간 정하기로 보낸다", () => {
    const rows = byKey(coordinating);
    expect(rows.attendance.state).toBe(MANAGE_ROW_STATE.locked);
    expect(rows.time.href).toBe("/games/game/confirm");
    expect(rows.time.state).toBe(MANAGE_ROW_STATE.open);
    expect(rows.roster.detail).toBe("확정·대기 옮기기, 참여자 추가, 내보내기를 합니다");
    expect(rows.edit.label).toBe("구인 수정");
  });

  it("조율 기한이 지나면 시간 줄만 붉게 막힌다", () => {
    const rows = byKey(gameWith({ endDate: at(-DAY) }));
    expect(rows.time.state).toBe(MANAGE_ROW_STATE.blocked);
    expect(rows.time.detail).toBe("조율 기한이 지났습니다 · 세션 일시를 빨리 정해 주세요");
    expect(rows.roster.state).toBe(MANAGE_ROW_STATE.open);
  });

  it("추첨 전에는 세션 시간 줄을 잠근다", () => {
    const rows = byKey(gameWith({ recruitMethod: RECRUIT_METHOD.lottery }));
    expect(rows.time.state).toBe(MANAGE_ROW_STATE.locked);
    expect(rows.time.detail).toBe("추첨을 먼저 마쳐 주세요");
  });

  it("조율형 시각이 정해지고 시작 전이면 세션 시간 바꾸기가 열린다", () => {
    const rows = byKey(gameWith({ confirmedAt: at(DAY) }));
    expect(rows.time.label).toBe("세션 시간 바꾸기");
    expect(rows.time.state).toBe(MANAGE_ROW_STATE.open);
    expect(rows.time.href).toBe("/games/game/confirm");
    expect(rows.time.detail).toBe("9월 21일 (월) 12:00 · 시작 전까지 바꿀 수 있습니다");
    expect(rows.edit.state).toBe(MANAGE_ROW_STATE.open);
  });

  it("조율형 시작 뒤에는 정한 시각만 보인다", () => {
    const rows = byKey(gameWith({ confirmedAt: at(-0.5 * HOUR) }));
    expect(rows.time.label).toBe("세션 시간 정하기");
    expect(rows.time.state).toBe(MANAGE_ROW_STATE.done);
    expect(rows.time.detail).toBe("9월 20일 (일) 11:30으로 정했습니다");
  });

  it("일시 지정형은 등록할 때 정한 시각이다", () => {
    const rows = byKey(gameWith({ scheduleMode: SCHEDULE_MODE.fixed, confirmedAt: at(DAY) }));
    expect(rows.time.label).toBe("세션 시간");
    expect(rows.time.state).toBe(MANAGE_ROW_STATE.done);
    expect(rows.time.detail).toBe("9월 21일 (월) 12:00 · 등록할 때 정한 시각입니다");
  });

  it("진행 중이고 확정 1명 이상이면 출석 확인 줄이 세션 마치기 창을 연다", () => {
    const rows = byKey(gameWith({ confirmedAt: at(-0.5 * HOUR) }));
    expect(rows.attendance.state).toBe(MANAGE_ROW_STATE.open);
    expect(rows.attendance.action).toBe(MANAGE_ROW_ACTION.endSession);
    expect(rows.attendance.href).toBeNull();
    expect(rows.edit.state).toBe(MANAGE_ROW_STATE.locked);
    expect(rows.edit.detail).toBe("시작한 세션은 고칠 수 없습니다");
    expect(rows.roster.state).toBe(MANAGE_ROW_STATE.open);
  });

  it("진행 중이어도 확정 0명이면 출석 확인은 잠긴다", () => {
    const rows = byKey(gameWith({ confirmedAt: at(-0.5 * HOUR), participants: [] }));
    expect(rows.attendance.state).toBe(MANAGE_ROW_STATE.locked);
    expect(rows.attendance.detail).toBe("세션이 끝난 뒤에 쓸 수 있습니다");
  });

  it("끝나면 출석 확인이 열리고 명단·수정은 닫힌다", () => {
    const rows = byKey(gameWith({ confirmedAt: at(-DAY) }));
    expect(rows.attendance.state).toBe(MANAGE_ROW_STATE.open);
    expect(rows.attendance.href).toBe("/games/game/attendance");
    expect(rows.roster.state).toBe(MANAGE_ROW_STATE.locked);
    expect(rows.edit.state).toBe(MANAGE_ROW_STATE.locked);
  });

  it("끝났고 출석 명단이 없으면 확정 참여자가 없다고 잠근다", () => {
    const rows = byKey(gameWith({ confirmedAt: at(-DAY), participants: [] }));
    expect(rows.attendance.detail).toBe("확정 참여자가 없습니다");
  });

  it("출석 기한이 지나면 확정 전이어도 정리한 것으로 본다", () => {
    const rows = byKey(gameWith({ confirmedAt: at(-10 * DAY) }));
    expect(rows.attendance.state).toBe(MANAGE_ROW_STATE.done);
    expect(rows.attendance.detail).toBe("출석을 정리했습니다");
  });

  it("세션 후기는 출석을 확인한 뒤에 열리고 받는 기한을 적는다", () => {
    expect(byKey(coordinating).review.state).toBe(MANAGE_ROW_STATE.locked);
    const rows = byKey(
      gameWith({
        confirmedAt: at(-2 * DAY),
        attendanceConfirmedAt: at(-DAY),
        attendanceFirstConfirmedAt: at(-DAY),
      }),
    );
    expect(rows.review.state).toBe(MANAGE_ROW_STATE.open);
    expect(rows.review.detail).toBe("후기 0개가 달렸습니다 · 10월 3일까지 받습니다");
  });

  it("처음 확정 3일 뒤 다시 확정해도 후기 기한은 처음 확정 + 14일이다", () => {
    const rows = byKey(
      gameWith({
        confirmedAt: at(-5 * DAY),
        attendanceFirstConfirmedAt: at(-4 * DAY),
        attendanceConfirmedAt: at(-DAY),
      }),
    );
    expect(rows.review.detail).toBe("후기 0개가 달렸습니다 · 9월 30일까지 받습니다");
  });

  it("취소한 구인은 여섯 줄이 모두 잠긴다", () => {
    const cancelled = gameWith({ cancelledAt: at(-HOUR), cancelKind: GAME_CANCEL_KIND.gm });
    const rows = manageRows({ game: cancelled, reviewCount: 0, now: NOW });
    expect(rows.every((row) => row.state === MANAGE_ROW_STATE.locked && !row.href)).toBe(true);
    expect(rows.every((row) => row.detail === "취소한 구인입니다")).toBe(true);
    expect(cancelRowLock({ game: cancelled, now: NOW })).toBe("취소한 구인입니다");
  });

  it("구인 취소 줄은 시작 전에만 열린다", () => {
    expect(cancelRowLock({ game: gameWith({ confirmedAt: at(HOUR) }), now: NOW })).toBeUndefined();
    expect(cancelRowLock({ game: gameWith({ confirmedAt: at(-HOUR) }), now: NOW })).toBe(
      "시작한 세션은 취소할 수 없습니다",
    );
  });
});
