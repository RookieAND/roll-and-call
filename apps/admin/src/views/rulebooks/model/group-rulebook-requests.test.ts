import { describe, expect, it } from "vitest";

import type { RulebookRequestRow } from "@/entities/rulebook/server";

import { groupRulebookRequests, reviewRequest } from "./group-rulebook-requests";

function book(id: string, groupId: string | null = null, processed = false): RulebookRequestRow {
  return {
    id,
    groupId,
    name: id,
    bookName: id,
    edition: "",
    kind: null,
    category: null,
    note: "",
    requesterNickname: "신청자",
    requestedAt: new Date("2026-11-10"),
    waitedDays: 0,
    games: null,
    otherRequesterCount: 0,
    groupTotal: groupId ? 3 : 1,
    groupCompleted: processed ? 1 : 0,
    outcome: processed ? "added" : null,
    rejectReason: null,
    processed: processed ? { by: "운영진", at: new Date() } : undefined,
  };
}

describe("groupRulebookRequests", () => {
  it("묶음 없는 기존 요청은 각각 표시한다", () => {
    expect(
      groupRulebookRequests([book("a"), book("b")]).map((rows) => rows.map((row) => row.id)),
    ).toEqual([["a"], ["b"]]);
  });
  it("같은 묶음만 모으고 접수 순서를 유지한다", () => {
    expect(
      groupRulebookRequests([book("a", "first"), book("b", "second"), book("c", "first")]).map(
        (rows) => rows.map((row) => row.id),
      ),
    ).toEqual([["a", "c"], ["b"]]);
  });
  it("일부 처리 후에도 서버가 집계한 전체 권수를 보존한다", () => {
    const pending = { ...book("a", "first"), groupCompleted: 2 };
    expect(groupRulebookRequests([pending])[0]?.[0]).toMatchObject({
      groupTotal: 3,
      groupCompleted: 2,
    });
  });
});

describe("reviewRequest", () => {
  const books = [book("done", "g", true), book("next", "g"), book("last", "g")];
  it("처리 후에는 첫 미처리 책을 선택한다", () => expect(reviewRequest(books)?.id).toBe("next"));
  it("처리한 책도 직접 선택해 결과를 볼 수 있다", () =>
    expect(reviewRequest(books, "done")?.id).toBe("done"));
  it("다른 묶음의 ID는 무시한다", () => expect(reviewRequest(books, "foreign")?.id).toBe("next"));
  it("모두 처리되면 결과를 보여주고 빈 목록도 허용한다", () => {
    expect(reviewRequest([books[0]!])?.id).toBe("done");
    expect(reviewRequest([])).toBeUndefined();
  });
});
