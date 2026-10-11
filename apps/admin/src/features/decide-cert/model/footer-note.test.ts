import { describe, expect, it } from "vitest";

import { footerNote } from "./footer-note";

const base = { reviewable: true, checkedCount: 0, checkableCount: 1 };
const group = { approveCount: 2, rejectCount: 0, reasonReady: false };

describe("footerNote", () => {
  it("한 권 신청은 사진 확인 진행을 알린다", () => {
    expect(footerNote(base)).toEqual({
      text: "사진 확인 0/1 · 모두 체크해야 승인할 수 있습니다",
      target: "photos",
    });
    expect(footerNote({ ...base, checkedCount: 1 })).toBeUndefined();
  });

  it("묶음에서 승인할 책이 있으면 사진 확인이 먼저다", () => {
    expect(footerNote({ ...base, group })?.target).toBe("photos");
  });

  it("전부 반려하면 사진 확인은 필요 없고 사유만 요구한다", () => {
    const allRejected = { approveCount: 0, rejectCount: 2, reasonReady: false };
    expect(footerNote({ ...base, group: allRejected })).toEqual({
      text: "반려 사유를 입력해야 확정할 수 있습니다",
      target: "reason",
    });
  });

  it("조건을 갖췄거나 심사할 수 없으면 안내가 없다", () => {
    expect(footerNote({ ...base, checkedCount: 1, group })).toBeUndefined();
    expect(footerNote({ ...base, reviewable: false, group })).toBeUndefined();
  });
});
