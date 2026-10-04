import { range } from "es-toolkit";
import { describe, expect, it } from "vitest";

import { planLotteryDraw } from "./plan-lottery-draw";

const applicantsOf = (rolls: number[]) =>
  rolls.map((roll, index) => ({ userId: `user-${index}`, roll }));

describe("planLotteryDraw", () => {
  it("신청 12명·정원 4명·직접 확정 1명이면 확정 3명·대기 9명이다", () => {
    const applicants = applicantsOf(range(12).map((index) => 90 - index * 7));
    const plan = planLotteryDraw({ applicants, confirmedCount: 1, maxPlayers: 4 });
    expect(plan.confirmed).toHaveLength(3);
    expect(plan.waiting).toHaveLength(9);
    expect(plan.confirmed.map((entry) => entry.roll)).toEqual([13, 20, 27]);
    expect(plan.waiting[0]).toMatchObject({ roll: 34, rank: 4 });
  });

  it("신청자가 뽑을 인원 이하이면 전원 확정한다", () => {
    const plan = planLotteryDraw({
      applicants: applicantsOf([50, 7, 77]),
      confirmedCount: 0,
      maxPlayers: 3,
    });
    expect(plan.confirmed.map((entry) => [entry.roll, entry.rank])).toEqual([
      [7, 1],
      [50, 2],
      [77, 3],
    ]);
    expect(plan.waiting).toEqual([]);
  });

  it("정원이 이미 찼으면 전원 대기다", () => {
    const plan = planLotteryDraw({
      applicants: applicantsOf([3, 1]),
      confirmedCount: 5,
      maxPlayers: 4,
    });
    expect(plan.confirmed).toEqual([]);
    expect(plan.waiting.map((entry) => entry.rank)).toEqual([1, 2]);
  });
});
