import { describe, expect, it } from "vitest";

import { footerNote } from "./footer-note";

const group = { approveCount: 2, rejectCount: 0, reasonReady: false };

describe("footerNote", () => {
  it("한 권 신청은 사진을 다 확인해야 한다", () => {
    expect(footerNote({ reviewable: true, allChecked: false })).toBe(
      "모든 확인 항목을 체크해야 승인할 수 있습니다",
    );
    expect(footerNote({ reviewable: true, allChecked: true })).toBeUndefined();
  });

  it("묶음에서 승인할 책이 있으면 사진 확인이 먼저다", () => {
    expect(footerNote({ reviewable: true, allChecked: false, group })).toBe(
      "승인하려면 모든 확인 항목을 체크해야 합니다",
    );
  });

  it("전부 반려하면 사진 확인은 필요 없고 사유만 요구한다", () => {
    const allRejected = { approveCount: 0, rejectCount: 2, reasonReady: false };
    expect(footerNote({ reviewable: true, allChecked: false, group: allRejected })).toBe(
      "반려 사유를 입력해야 확정할 수 있습니다",
    );
  });

  it("조건을 갖췄거나 심사할 수 없으면 안내가 없다", () => {
    expect(footerNote({ reviewable: true, allChecked: true, group })).toBeUndefined();
    expect(footerNote({ reviewable: false, allChecked: false, group })).toBeUndefined();
  });
});
