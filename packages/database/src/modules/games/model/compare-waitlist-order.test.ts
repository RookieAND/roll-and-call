import { describe, expect, it } from "vitest";

import { compareWaitlistOrder } from "./compare-waitlist-order";

const at = (minutes: number) => new Date(Date.UTC(2026, 9, 1, 0, minutes));

describe("compareWaitlistOrder", () => {
  it("신청 대기 두 명 뒤에 GM이 내린 사람이 맨 뒤에 선다", () => {
    const members = [
      { userId: "demoted", joinedAt: at(0), waitlistedAt: at(30), drawRank: null },
      { userId: "first", joinedAt: at(5), waitlistedAt: at(5), drawRank: null },
      { userId: "second", joinedAt: at(10), waitlistedAt: at(10), drawRank: null },
    ];
    expect(members.toSorted(compareWaitlistOrder).map((member) => member.userId)).toEqual([
      "first",
      "second",
      "demoted",
    ]);
  });

  it("추첨 대기는 같은 waitlistedAt 안에서 drawRank 순서다", () => {
    const members = [
      { userId: "rank4", joinedAt: at(1), waitlistedAt: at(20), drawRank: 4 },
      { userId: "unranked", joinedAt: at(0), waitlistedAt: at(20), drawRank: null },
      { userId: "rank3", joinedAt: at(2), waitlistedAt: at(20), drawRank: 3 },
    ];
    expect(members.toSorted(compareWaitlistOrder).map((member) => member.userId)).toEqual([
      "rank3",
      "rank4",
      "unranked",
    ]);
  });

  it("waitlistedAt이 없는 옛 행은 joinedAt으로 줄 선다", () => {
    const members = [
      { userId: "late", joinedAt: at(9), waitlistedAt: null },
      { userId: "early", joinedAt: at(3) },
      { userId: "middle", joinedAt: at(1), waitlistedAt: at(5) },
    ];
    expect(members.toSorted(compareWaitlistOrder).map((member) => member.userId)).toEqual([
      "early",
      "middle",
      "late",
    ]);
  });
});
