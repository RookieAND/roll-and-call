import type { GameDetailData } from "@roll-and-call/database/games";
import { describe, expect, it } from "vitest";

import {
  GAME_CANCEL_KIND,
  PARTICIPANT_STATUS,
  RECRUIT_METHOD,
  SCHEDULE_MODE,
} from "@/entities/game";

import { MANAGE_REVIEW_BUTTON } from "./manage-review-button";
import { MANAGE_ROW_ACTION, MANAGE_ROW_STATE } from "./manage-row-state";
import { manageRowGroups } from "./manage-rows";

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

const groupsOf = (
  game: GameDetailData,
  reviewCount = 0,
  gmReview: "write" | "view" | null = null,
) =>
  manageRowGroups({
    game,
    reviewCount,
    gmReview: gmReview === null ? null : MANAGE_REVIEW_BUTTON[gmReview],
    now: NOW,
  });

const rowOf = (game: GameDetailData, key: string) => {
  const groups = groupsOf(game);
  const row = [...groups.progress, ...groups.management, ...groups.review].find(
    (candidate) => candidate.key === key,
  );
  if (!row) throw new Error(`no row ${key}`);
  return row;
};

describe("manageRowGroups", () => {
  it("그룹과 줄 순서는 늘 같다", () => {
    const groups = groupsOf(coordinating);
    expect(groups.progress.map((row) => row.key)).toEqual(["time", "attendance", "end"]);
    expect(groups.management.map((row) => row.key)).toEqual(["roster", "edit"]);
    expect(groups.review.map((row) => row.key)).toEqual(["review"]);
  });

  it("조율 중에는 시간 줄을 열고 세션 마치기는 잠근다", () => {
    expect(rowOf(coordinating, "time").detail).toBe("겹치는 시간을 보고 세션 일시를 정합니다");
    expect(rowOf(coordinating, "end")).toMatchObject({
      state: MANAGE_ROW_STATE.locked,
      detail: "세션이 시작되면 마칠 수 있습니다",
    });
    expect(rowOf(coordinating, "roster")).toMatchObject({
      detail: "명단 옮기기·추가·내보내기",
      state: MANAGE_ROW_STATE.open,
    });
    expect(rowOf(coordinating, "edit").detail).toBe("제목·소개·이미지·모집 조건을 고칩니다");
  });

  it("조율 기한이 지나면 시간 줄만 붉게 막힌다", () => {
    const overdue = gameWith({ endDate: at(-DAY) });
    expect(rowOf(overdue, "time")).toMatchObject({
      state: MANAGE_ROW_STATE.blocked,
      detail: "조율 기한이 지났습니다",
    });
  });

  it("진행 중이고 확정 1명 이상이면 출석 입력과 세션 마치기가 열린다", () => {
    const live = gameWith({
      confirmedAt: at(-HOUR / 2),
      scheduleMode: SCHEDULE_MODE.fixed,
      endDate: at(-DAY),
    });
    expect(rowOf(live, "attendance")).toMatchObject({
      state: MANAGE_ROW_STATE.open,
      href: "/games/game/attendance",
      detail: "참석·불참을 표시합니다",
    });
    expect(rowOf(live, "end")).toMatchObject({
      state: MANAGE_ROW_STATE.open,
      detail: "세션을 지금 마칩니다",
      action: MANAGE_ROW_ACTION.endSession,
    });
    expect(rowOf(live, "edit").detail).toBe("시작한 세션은 고칠 수 없습니다");
  });

  it("진행 중이어도 확정 0명이면 출석 입력과 세션 마치기는 잠긴다", () => {
    const empty = gameWith({
      confirmedAt: at(-HOUR / 2),
      scheduleMode: SCHEDULE_MODE.fixed,
      participants: [],
    });
    expect(rowOf(empty, "attendance").detail).toBe("확정 참여자가 없습니다");
    expect(rowOf(empty, "end")).toMatchObject({
      state: MANAGE_ROW_STATE.locked,
      detail: "확정 참여자가 없습니다",
    });
  });

  it("세션 후기는 시작 뒤 열리고 개수를 보인다", () => {
    const live = gameWith({ confirmedAt: at(-HOUR / 2), scheduleMode: SCHEDULE_MODE.fixed });
    expect(rowOf(live, "review")).toMatchObject({
      label: "세션 후기 보기",
      detail: "아직 후기가 없습니다",
      state: MANAGE_ROW_STATE.open,
    });
    expect(groupsOf(live, 2).review[0]?.detail).toBe("후기 2개");
    expect(rowOf(coordinating, "review").detail).toBe("세션이 시작되면 열립니다");
  });

  it("마스터링 후기를 쓸 수 있으면 작성 줄을, 이미 썼으면 보기 줄을 더한다", () => {
    const ended = gameWith({
      confirmedAt: at(-2 * DAY),
      scheduleMode: SCHEDULE_MODE.fixed,
      endDate: at(-3 * DAY),
    });
    const writable = groupsOf(ended, 0, "write").review[1];
    expect(writable).toMatchObject({
      label: "마스터링 후기 작성하기",
      href: "/games/game/review",
      state: MANAGE_ROW_STATE.open,
    });
    expect(writable?.detail).toMatch(/까지 작성할 수 있습니다$/);
    expect(groupsOf(ended, 0, "view").review[1]).toMatchObject({
      label: "내 마스터링 후기 보기",
      detail: "",
    });
    expect(groupsOf(ended, 0, null).review).toHaveLength(1);
  });

  it("취소한 구인은 모든 줄이 잠기고 후기는 한 줄만 남는다", () => {
    const cancelled = gameWith({
      cancelledAt: at(-HOUR),
      cancelKind: GAME_CANCEL_KIND.gm,
      confirmedAt: at(-2 * HOUR),
    });
    const groups = groupsOf(cancelled, 0, "write");
    const rows = [...groups.progress, ...groups.management, ...groups.review];
    expect(rows.every((row) => row.detail === "취소한 구인입니다")).toBe(true);
    expect(rows.every((row) => row.state === MANAGE_ROW_STATE.locked)).toBe(true);
    expect(groups.review.map((row) => row.label)).toEqual(["세션 후기"]);
  });
});
