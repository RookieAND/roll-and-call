import { describe, expect, it } from "vitest";

import { MEMBERSHIP_STATUS, type MembershipStatus } from "@/shared/lib";

import { pickStaffCandidates, STAFF_CANDIDATE_LIMIT } from "./pick-staff-candidates";

const user = (
  id: string,
  nickname: string,
  membership: MembershipStatus = MEMBERSHIP_STATUS.active,
) => ({
  id,
  nickname,
  discordHandle: id,
  joinedAt: new Date("2026-09-01"),
  membership,
});

describe("pickStaffCandidates", () => {
  it("운영진과 닉네임이 같은 일반 멤버는 나오고 운영진 본인은 빠진다", () => {
    const users = [user("staff", "달빛토끼"), user("member", "달빛토끼")];
    const picked = pickStaffCandidates({ users, staffIds: new Set(["staff"]), query: "달빛" });
    expect(picked.map((candidate) => candidate.id)).toEqual(["member"]);
  });

  it("대소문자 없이 부분 일치, 나간 멤버는 빼고, 빈 검색어는 결과 없음", () => {
    const users = [user("a", "BlueCat"), user("b", "bluefish", MEMBERSHIP_STATUS.left)];
    expect(pickStaffCandidates({ users, staffIds: new Set(), query: "blue" })).toHaveLength(1);
    expect(pickStaffCandidates({ users, staffIds: new Set(), query: "  " })).toEqual([]);
  });

  it("21명 이상이면 20명까지", () => {
    const users = Array.from({ length: 25 }, (_, index) => user(`u${index}`, `파란${index}`));
    expect(pickStaffCandidates({ users, staffIds: new Set(), query: "파란" })).toHaveLength(
      STAFF_CANDIDATE_LIMIT,
    );
  });
});
