import { describe, expect, it } from "vitest";

import { RECRUIT_METHOD } from "@/entities/game";

import type { ManagedMember } from "./managed-member";
import { summarizeRoster } from "./roster-summary";

function member(userId: string, waitlistRank: number | null): ManagedMember {
  return {
    userId,
    username: userId,
    avatarUrl: null,
    waitlistRank,
    hasAvailability: true,
    joinedAt: new Date("2026-09-18T00:00:00Z"),
    removed: false,
  };
}

const base = {
  maxPlayers: 4,
  endDate: new Date("2026-09-30T00:00:00Z"),
  isCoordinate: false,
  started: false,
  capacityRaised: false,
  now: new Date("2026-09-20T00:00:00Z"),
};

describe("summarizeRoster", () => {
  it("뽑기 전 직접 확정한 사람만큼 뽑을 인원을 뺀다", () => {
    const summary = summarizeRoster({
      ...base,
      confirmed: [member("pre", null)],
      waiting: [member("a", 1), member("b", 2)],
      recruitMethod: RECRUIT_METHOD.lottery,
      drawnAt: null,
    });
    expect(summary.drawCount).toBe(3);
    expect(summary.applicantCount).toBe(2);
  });

  it("선착순에서는 직접 확정을 뽑을 인원에서 빼지 않는다", () => {
    const summary = summarizeRoster({
      ...base,
      confirmed: [member("a", null)],
      waiting: [],
      recruitMethod: RECRUIT_METHOD.firstCome,
      drawnAt: null,
    });
    expect(summary.drawCount).toBe(4);
  });

  it("추첨 글이 신청자 없이 마감되면 그 상태로 본다", () => {
    const closed = summarizeRoster({
      ...base,
      endDate: new Date("2026-09-19T00:00:00Z"),
      confirmed: [],
      waiting: [],
      recruitMethod: RECRUIT_METHOD.lottery,
      drawnAt: null,
    });
    expect(closed.noApplicantsClosed).toBe(true);

    const open = summarizeRoster({
      ...base,
      confirmed: [],
      waiting: [],
      recruitMethod: RECRUIT_METHOD.lottery,
      drawnAt: null,
    });
    expect(open.noApplicantsClosed).toBe(false);
  });
});
