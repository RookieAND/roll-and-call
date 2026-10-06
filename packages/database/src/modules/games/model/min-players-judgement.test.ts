import { describe, expect, it } from "vitest";

import { canDrawLottery } from "./can-draw-lottery";
import { judgeMinPlayers } from "./min-players-judgement";

const base = {
  recruitMethod: "first_come",
  minPlayers: 3,
  confirmedCount: 0,
  applicantCount: 0,
  judgedAt: null,
} as const;

describe("judgeMinPlayers", () => {
  it.each([
    ["최소 인원 없음", { minPlayers: null }, "skip"],
    ["이미 판정함", { judgedAt: new Date(), confirmedCount: 0 }, "skip"],
    ["선착순 확정자 = M", { confirmedCount: 3 }, "pass"],
    ["선착순 확정자 = M-1", { confirmedCount: 2 }, "cancel"],
    ["선착순 확정자가 M 초과", { confirmedCount: 5 }, "pass"],
    ["추첨 신청자 = M", { recruitMethod: "lottery", applicantCount: 3 }, "pass"],
    ["추첨 신청자 = M-1", { recruitMethod: "lottery", applicantCount: 2 }, "cancel"],
    [
      "추첨 신청자 + 직접 확정자 = M",
      { recruitMethod: "lottery", applicantCount: 2, confirmedCount: 1 },
      "pass",
    ],
    [
      "추첨 신청자 + 직접 확정자 = M-1",
      { recruitMethod: "lottery", applicantCount: 1, confirmedCount: 1 },
      "cancel",
    ],
  ] as const)("%s → %s", (_name, override, expected) => {
    expect(judgeMinPlayers({ ...base, ...override })).toBe(expected);
  });
});

describe("canDrawLottery", () => {
  it.each([
    [2, 0, 3, false],
    [3, 0, 3, true],
    [1, 1, 3, false],
    [2, 1, 3, true],
    [0, 0, null, true],
  ])(
    "신청 %i명·직접 확정 %i명·최소 %s → %s",
    (applicantCount, confirmedCount, minPlayers, expected) => {
      expect(canDrawLottery({ minPlayers, confirmedCount, applicantCount })).toBe(expected);
    },
  );
});
