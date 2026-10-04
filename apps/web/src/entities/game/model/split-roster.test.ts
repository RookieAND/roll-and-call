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

  it("추첨 적용 시각이 같은 대기는 신청 순서가 아니라 drawRank가 대기 순번을 정한다", () => {
    const drawnAt = new Date(10);
    const drawn = [
      {
        userId: "a",
        status: PARTICIPANT_STATUS.waiting,
        joinedAt: new Date(1),
        drawRank: 4,
        waitlistedAt: drawnAt,
      },
      { userId: "b", status: PARTICIPANT_STATUS.confirmed, joinedAt: new Date(2), drawRank: 1 },
      {
        userId: "c",
        status: PARTICIPANT_STATUS.waiting,
        joinedAt: new Date(3),
        drawRank: 3,
        waitlistedAt: drawnAt,
      },
    ];
    expect(
      splitRoster(drawn).waiting.map((member) => [member.userId, member.waitlistRank]),
    ).toEqual([
      ["c", 1],
      ["a", 2],
    ]);
  });

  it("GM이 내린 사람은 신청이 빨라도 대기 맨 뒤에 선다", () => {
    const demoted = [
      ...roster,
      {
        userId: "z",
        status: PARTICIPANT_STATUS.waiting,
        joinedAt: new Date(0),
        waitlistedAt: new Date(9),
      },
    ];
    expect(
      splitRoster(demoted).waiting.map((member) => [member.userId, member.waitlistRank]),
    ).toEqual([
      ["c", 1],
      ["d", 2],
      ["z", 3],
    ]);
  });

  it("removed는 확정·대기 어디에도 들어가지 않고 removed 배열로 간다", () => {
    const withRemoved = [
      ...roster,
      { userId: "e", status: PARTICIPANT_STATUS.removed, joinedAt: new Date(0) },
    ];
    const split = splitRoster(withRemoved);
    expect(split.confirmed.map((member) => member.userId)).toEqual(["a", "b"]);
    expect(split.waiting.map((member) => member.userId)).toEqual(["c", "d"]);
    expect(split.removed.map((member) => [member.userId, member.waitlistRank])).toEqual([
      ["e", null],
    ]);
    expect(split.waiting.map((member) => member.waitlistRank)).toEqual([1, 2]);
  });
});

describe("countConfirmed", () => {
  it("확정만 센다", () => {
    expect(countConfirmed(roster)).toBe(2);
  });
});
