import { describe, expect, it } from "vitest";

import type { GroupBook } from "./group-book";
import { groupApproveIds, groupRejectIds } from "./group-selection";

const book = (applicationId: string, status: GroupBook["status"]): GroupBook => ({
  applicationId,
  label: applicationId,
  status,
  href: "",
});

const books = [book("a", "pending"), book("b", "pending"), book("c", "approved")];

describe("묶음 책 선택", () => {
  it("반려로 바꾼 책만 반려하고 나머지는 승인한다", () => {
    expect(groupApproveIds({ books, rejectedIds: ["b"] })).toEqual(["a"]);
    expect(groupRejectIds({ books, rejectedIds: ["b"] })).toEqual(["b"]);
  });

  it("아무것도 바꾸지 않으면 대기 중인 책을 모두 승인한다", () => {
    expect(groupApproveIds({ books, rejectedIds: [] })).toEqual(["a", "b"]);
    expect(groupRejectIds({ books, rejectedIds: [] })).toEqual([]);
  });

  it("이미 처리된 책은 대상이 아니다", () => {
    expect(groupRejectIds({ books, rejectedIds: ["c"] })).toEqual([]);
  });
});
