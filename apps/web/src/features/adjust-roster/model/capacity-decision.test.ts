import { describe, expect, it } from "vitest";

import { CAPACITY_ACTION } from "./capacity-action";
import { capacityDecision } from "./capacity-decision";

const base = {
  action: CAPACITY_ACTION.add,
  started: false,
  confirmedCount: 4,
  maxPlayers: 4,
  addingCount: 1,
  raiseCapacity: false,
  alreadyRaised: false,
};

describe("capacityDecision", () => {
  it("세션 시작 전 정원을 넘으면 거부한다", () => {
    expect(capacityDecision(base)).toEqual({ error: "남은 자리가 0자리뿐입니다." });
    expect(capacityDecision({ ...base, action: CAPACITY_ACTION.promote })).toEqual({
      error: "정원 4명이 차 있습니다. 확정에서 한 명을 대기로 옮겨 주세요.",
    });
  });

  it("세션 시작 전에는 정원을 늘릴 수 없다", () => {
    expect(capacityDecision({ ...base, confirmedCount: 1, raiseCapacity: true })).toEqual({
      error: "세션이 시작된 뒤에만 정원을 늘릴 수 있습니다.",
    });
  });

  it("세션 시작 뒤 자리가 있으면 그대로 넣는다", () => {
    expect(
      capacityDecision({ ...base, started: true, confirmedCount: 3, raiseCapacity: true }),
    ).toEqual({ raise: false });
  });

  it("세션 시작 뒤 정원이 찼는데 늘리기를 고르지 않으면 거부한다", () => {
    expect(capacityDecision({ ...base, started: true })).toEqual({
      error: "정원 4명이 차 있습니다.",
    });
  });

  it("세션 시작 뒤 1명이고 처음이면 정원을 늘린다", () => {
    expect(capacityDecision({ ...base, started: true, raiseCapacity: true })).toEqual({
      raise: true,
    });
  });

  it("이미 늘렸으면 거부한다", () => {
    expect(
      capacityDecision({ ...base, started: true, raiseCapacity: true, alreadyRaised: true }),
    ).toEqual({ error: "이미 정원을 한 번 늘렸습니다." });
  });

  it("늘릴 때 2명이면 거부한다", () => {
    expect(
      capacityDecision({ ...base, started: true, raiseCapacity: true, addingCount: 2 }),
    ).toEqual({ error: "정원을 늘릴 때는 1명만 넣을 수 있습니다." });
  });
});
