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
  it("체크한 책은 승인, 체크하지 않은 책은 반려 대상이다", () => {
    expect(groupApproveIds({ books, uncheckedIds: ["b"] })).toEqual(["a"]);
    expect(groupRejectIds({ books, uncheckedIds: ["b"] })).toEqual(["b"]);
  });

  it("이미 처리된 책은 대상이 아니다", () => {
    expect(groupApproveIds({ books, uncheckedIds: [] })).toEqual(["a", "b"]);
    expect(groupRejectIds({ books, uncheckedIds: ["c"] })).toEqual([]);
  });
});
