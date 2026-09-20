import { describe, expect, it } from "vitest";

import { countConfirmed, PARTICIPANT_STATUS } from "./participant";
import { splitRoster } from "./split-roster";

const roster = [
  { userId: "b", status: PARTICIPANT_STATUS.confirmed, joinedAt: new Date(2) },
  { userId: "a", status: PARTICIPANT_STATUS.confirmed, joinedAt: new Date(1) },
  { userId: "c", status: PARTICIPANT_STATUS.waiting, joinedAt: new Date(3) },
  { userId: "d", status: PARTICIPANT_STATUS.waiting, joinedAt: new Date(4) },
];

describe("splitRoster", () => {
  it("확정은 신청 순서대로 순번을 받는다", () => {
    expect(
      splitRoster(roster).confirmed.map((member) => [member.userId, member.applicationRank]),
    ).toEqual([
      ["a", 1],
      ["b", 2],
    ]);
  });

  it("대기는 신청 순번과 대기 순번을 따로 센다", () => {
    expect(
      splitRoster(roster).waiting.map((member) => [
        member.userId,
        member.applicationRank,
        member.waitlistRank,
      ]),
    ).toEqual([
      ["c", 3, 1],
      ["d", 4, 2],
    ]);
  });

  it("추첨을 돌린 뒤에는 신청 순서가 아니라 drawRank가 대기 순번을 정한다", () => {
    const drawn = [
      { userId: "a", status: PARTICIPANT_STATUS.waiting, joinedAt: new Date(1), drawRank: 4 },
      { userId: "b", status: PARTICIPANT_STATUS.confirmed, joinedAt: new Date(2), drawRank: 1 },
      { userId: "c", status: PARTICIPANT_STATUS.waiting, joinedAt: new Date(3), drawRank: 3 },
    ];
    expect(
      splitRoster(drawn).waiting.map((member) => [member.userId, member.waitlistRank]),
    ).toEqual([
      ["c", 1],
      ["a", 2],
    ]);
  });
});

describe("countConfirmed", () => {
  it("확정만 센다", () => {
    expect(countConfirmed(roster)).toBe(2);
  });
});
