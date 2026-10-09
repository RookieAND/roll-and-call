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
    applicationNote: null,
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

  describe("blockedMinPlayers", () => {
    const lottery = { ...base, recruitMethod: RECRUIT_METHOD.lottery, drawnAt: null };

    it("신청자가 최소 인원에 못 미치면 최소 인원을 돌려준다", () => {
      const summary = summarizeRoster({
        ...lottery,
        minPlayers: 3,
        confirmed: [],
        waiting: [member("a", 1), member("b", 2)],
      });
      expect(summary.blockedMinPlayers).toBe(3);
    });

    it("최소 인원을 채우면 막지 않는다", () => {
      const summary = summarizeRoster({
        ...lottery,
        minPlayers: 3,
        confirmed: [],
        waiting: [member("a", 1), member("b", 2), member("c", 3)],
      });
      expect(summary.blockedMinPlayers).toBeNull();
    });

    it("직접 확정한 사람도 채운 수에 넣는다", () => {
      const summary = summarizeRoster({
        ...lottery,
        minPlayers: 3,
        confirmed: [member("pre", null)],
        waiting: [member("a", 1), member("b", 2)],
      });
      expect(summary.blockedMinPlayers).toBeNull();
    });

    it("최소 인원이 없거나 추첨 글이 아니면 막지 않는다", () => {
      const waiting = [member("a", 1)];
      expect(summarizeRoster({ ...lottery, confirmed: [], waiting }).blockedMinPlayers).toBeNull();
      expect(
        summarizeRoster({
          ...base,
          minPlayers: 3,
          recruitMethod: RECRUIT_METHOD.firstCome,
          drawnAt: null,
          confirmed: [],
          waiting,
        }).blockedMinPlayers,
      ).toBeNull();
    });
  });

  it("선발 전에는 신청자로 보고, 확정 0명이면 마칠 수 없다", () => {
    const summary = summarizeRoster({
      ...base,
      confirmed: [],
      waiting: [member("a", 1), member("b", 2)],
      recruitMethod: RECRUIT_METHOD.selection,
      drawnAt: null,
    });
    expect(summary).toMatchObject({
      selectionOpen: true,
      beforeDraw: true,
      finishBlock: "no_confirmed",
      methodLabel: "선발",
    });
  });

  it("선발 글 최소 인원은 확정과 신청을 더해 본다", () => {
    const open = {
      ...base,
      waiting: [member("a", 1)],
      recruitMethod: RECRUIT_METHOD.selection,
      drawnAt: null,
      minPlayers: 3,
    };
    expect(summarizeRoster({ ...open, confirmed: [member("pre", null)] }).finishBlock).toBe(
      "min_players_unmet",
    );
    expect(
      summarizeRoster({ ...open, confirmed: [member("p1", null), member("p2", null)] }).finishBlock,
    ).toBeNull();
  });

  it("선발을 마친 뒤에는 대기로 보이고 완료 표시", () => {
    const summary = summarizeRoster({
      ...base,
      confirmed: [member("a", null)],
      waiting: [member("b", 1)],
      recruitMethod: RECRUIT_METHOD.selection,
      drawnAt: null,
      selectionFinishedAt: new Date("2026-09-19T00:00:00Z"),
    });
    expect(summary).toMatchObject({
      selectionOpen: false,
      beforeDraw: false,
      finishBlock: null,
      methodLabel: "선발 완료",
    });
  });
});
