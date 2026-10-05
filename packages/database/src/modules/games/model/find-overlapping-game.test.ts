import { describe, expect, it } from "vitest";

import { findOverlappingGame, type MySessionTiming } from "./find-overlapping-game";

const MINUTE = 60_000;
const base = new Date("2026-10-10T10:00:00Z").getTime();
const at = (minutes: number) => new Date(base + minutes * MINUTE);

const session = (
  id: string,
  startMinutes: number,
  playMinutes: number | null,
  endedAtMinutes: number | null = null,
): MySessionTiming => ({
  id,
  confirmedAt: at(startMinutes),
  playMinutes,
  endedAt: endedAtMinutes === null ? null : at(endedAtMinutes),
});

const target = { startsAt: at(0), playMinutes: 120 };
const overlapIds = (mine: MySessionTiming[]) =>
  findOverlappingGame({ target, mine }).map((s) => s.id);

describe("findOverlappingGame", () => {
  it("완전히 같은 시간이면 겹친다", () => {
    expect(overlapIds([session("a", 0, 120)])).toEqual(["a"]);
  });

  it("일부만 겹쳐도 겹친다", () => {
    expect(overlapIds([session("a", 90, 120), session("b", -60, 90)])).toEqual(["b", "a"]);
  });

  it("한쪽이 다른 쪽을 포함해도 겹친다", () => {
    expect(overlapIds([session("a", 30, 30), session("b", -60, 300)])).toEqual(["b", "a"]);
  });

  it("앞 세션의 끝과 뒤 세션의 시작이 같으면 겹치지 않는다", () => {
    expect(overlapIds([session("a", -120, 120), session("b", 120, 60)])).toEqual([]);
  });

  it("1분만 겹쳐도 겹친다", () => {
    expect(overlapIds([session("a", -120, 121), session("b", 119, 60)])).toEqual(["a", "b"]);
  });

  it("플레이타임이 비어 있으면 3시간으로 본다", () => {
    expect(overlapIds([session("a", -179, null)])).toEqual(["a"]);
    expect(overlapIds([session("a", -180, null)])).toEqual([]);
    expect(
      findOverlappingGame({
        target: { startsAt: at(0), playMinutes: null },
        mine: [session("a", 179, 60)],
      }),
    ).toHaveLength(1);
    expect(
      findOverlappingGame({
        target: { startsAt: at(0), playMinutes: null },
        mine: [session("a", 180, 60)],
      }),
    ).toHaveLength(0);
  });

  it("이미 끝난 세션은 실제 종료 시각으로 본다", () => {
    expect(overlapIds([session("a", -180, 240, -90)])).toEqual([]);
    expect(overlapIds([session("a", -180, 60, 30)])).toEqual(["a"]);
  });

  it("겹치는 세션이 여럿이면 시작이 이른 순이다", () => {
    expect(overlapIds([session("late", 60, 60), session("early", -30, 60)])).toEqual([
      "early",
      "late",
    ]);
  });

  it("문자열 시각도 받는다", () => {
    const mine = [{ ...session("a", 0, 60), confirmedAt: at(0).toISOString() }];
    expect(overlapIds(mine)).toEqual(["a"]);
  });
});
