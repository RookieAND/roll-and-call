import { describe, expect, it } from "vitest";

import type { GrantOptions } from "@/shared/server";

import {
  GRANT_CANDIDATE_STATUS,
  grantCandidateStatus,
  grantMemberPlan,
} from "./grant-candidate-status";
import { grantMemberText } from "./grant-candidate-text";
import { grantResultToast } from "./grant-result-toast";
import { searchGrantMembers } from "./search-grant-members";

const book = (id: string, kind: GrantOptions["books"][number]["kind"] = "core") => ({
  id,
  label: `${id} 3rd`,
  kind,
  category: "더블크로스",
  edition: "3rd",
  certRequired: true,
  supersedesId: null,
});

const member = (id: string, nickname: string) => ({
  id,
  nickname,
  discordId: `${id}0000`,
  discordHandle: `${nickname}Handle`,
});

const options: GrantOptions = {
  books: [book("1권"), book("2권"), book("상급", "supplement")],
  members: [member("coco", "김코코"), member("kokoa", "김코코아"), member("nut", "코코넛GM")],
  certifications: [
    { userId: "nut", rulebookId: "1권" },
    { userId: "nut", rulebookId: "2권" },
    { userId: "coco", rulebookId: "2권" },
  ],
  pending: [{ userId: "coco", rulebookId: "1권" }],
  applied: [
    { userId: "coco", rulebookId: "1권" },
    { userId: "kokoa", rulebookId: "2권" },
  ],
};

describe("grantCandidateStatus", () => {
  const statusOf = (userId: string, bookIndex: number) =>
    grantCandidateStatus({ userId, book: options.books[bookIndex]!, options });

  it("이미 인증·대기 중·지난 신청·신청 없음을 가른다", () => {
    expect(statusOf("nut", 0)).toBe(GRANT_CANDIDATE_STATUS.certified);
    expect(statusOf("coco", 0)).toBe(GRANT_CANDIDATE_STATUS.pending);
    expect(statusOf("kokoa", 1)).toBe(GRANT_CANDIDATE_STATUS.applied);
    expect(statusOf("kokoa", 0)).toBe(GRANT_CANDIDATE_STATUS.none);
  });

  it("서플리먼트는 같은 판본 기본 룰북을 모두 가진 사람만 고를 수 있다", () => {
    expect(statusOf("coco", 2)).toBe(GRANT_CANDIDATE_STATUS.blocked);
    expect(statusOf("nut", 2)).toBe(GRANT_CANDIDATE_STATUS.none);
  });
});

describe("searchGrantMembers", () => {
  it("닉네임·핸들·ID를 대소문자 없이 찾고 고른 사람과 빈 검색어는 뺀다", () => {
    const ids = (query: string, excludeIds: string[] = []) =>
      searchGrantMembers({ members: options.members, query, excludeIds }).map((row) => row.id);
    expect(ids("코코")).toEqual(["coco", "kokoa", "nut"]);
    expect(ids("코코", ["coco"])).toEqual(["kokoa", "nut"]);
    expect(ids("NUT0000")).toEqual(["nut"]);
    expect(ids("  ")).toEqual([]);
  });
});

describe("grantMemberPlan", () => {
  const plan = (userId: string, bookIndexes: number[]) =>
    grantMemberPlan({
      userId,
      books: bookIndexes.map((index) => options.books[index]!),
      options,
    });

  it("함께 고른 기본 룰북은 서플리먼트 조건을 채운다", () => {
    expect(plan("coco", [2]).grantable).toEqual([]);
    expect(plan("coco", [0, 2]).grantable.map((row) => row.id)).toEqual(["1권", "상급"]);
  });

  it("이미 인증한 책은 빼고 나머지만 부여하며 대기 중인 심사를 센다", () => {
    const result = plan("coco", [0, 1]);
    expect(result.grantable.map((row) => row.id)).toEqual(["1권"]);
    expect(result.alreadyCertified.map((row) => row.id)).toEqual(["2권"]);
    expect(result.approving.map((row) => row.id)).toEqual(["1권"]);
  });

  it("고른 책을 모두 인증했으면 부여할 책이 없다", () => {
    expect(plan("nut", [0, 1]).grantable).toEqual([]);
  });
});

describe("grantMemberText", () => {
  const textOf = (userId: string, bookIndexes: number[]) =>
    grantMemberText(
      grantMemberPlan({
        userId,
        books: bookIndexes.map((index) => options.books[index]!),
        options,
      }),
    );

  it("룰북을 고르지 않으면 상태 문구가 없다", () => {
    expect(textOf("coco", [])).toBeNull();
  });

  it("책 하나는 그 책의 상태를 그대로 보인다", () => {
    expect(textOf("nut", [0])).toBe("이미 이 책을 인증했습니다");
    expect(textOf("kokoa", [0])).toBe("신청 기록이 없습니다");
  });

  it("여러 권이면 권수로 요약한다", () => {
    expect(textOf("coco", [0, 1])).toBe(
      "1권을 부여합니다 · 대기 중인 심사 1건을 승인합니다 · 1권은 이미 인증했습니다",
    );
    expect(textOf("nut", [0, 1])).toBe("고른 룰북을 모두 인증했습니다");
  });
});

describe("grantResultToast", () => {
  it("부여한 수와 이미 인증되어 뺀 사람을 알린다", () => {
    expect(
      grantResultToast({
        books: [
          {
            rulebookLabel: "1권 3rd",
            granted: [{ nickname: "김코코" }, { nickname: "김코코아" }],
            skipped: [{ nickname: "코코넛GM", reason: "alreadyCertified" }],
          },
        ],
      }),
    ).toEqual({
      success: true,
      title: "2명에게 1권 3rd 인증을 부여했습니다",
      description: "코코넛GM님은 이미 인증되어 빼고 부여했습니다",
    });
  });

  it("여러 권이면 사람 수와 권수를 알리고 빠진 사람은 룰북별로 밝힌다", () => {
    expect(
      grantResultToast({
        books: [
          {
            rulebookLabel: "1권 3rd",
            granted: [{ nickname: "김코코" }, { nickname: "김코코아" }],
            skipped: [],
          },
          {
            rulebookLabel: "2권 3rd",
            granted: [{ nickname: "김코코아" }],
            skipped: [{ nickname: "김코코", reason: "alreadyCertified" }],
          },
        ],
      }),
    ).toEqual({
      success: true,
      title: "2명에게 룰북 2권의 인증을 부여했습니다",
      description: "2권 3rd: 김코코님은 이미 인증되어 빼고 부여했습니다",
    });
  });

  it("아무도 부여하지 못하면 실패로 알린다", () => {
    expect(
      grantResultToast({
        books: [
          {
            rulebookLabel: "상급 3rd",
            granted: [],
            skipped: [{ nickname: "김코코", reason: "supplementBlocked" }],
          },
        ],
      }),
    ).toMatchObject({ success: false, title: "기본 룰북 인증이 먼저 필요합니다" });
  });
});
