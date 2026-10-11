import { describe, expect, it } from "vitest";

import { footerNote } from "./footer-note";

const base = {
  reviewable: true,
  allChecked: true,
  groupMode: true,
  approveBookCount: 2,
};

describe("footerNote", () => {
  it("사진을 다 확인하지 않았으면 그 안내가 먼저다", () => {
    expect(footerNote({ ...base, allChecked: false })).toBe(
      "모든 확인 항목을 체크해야 승인할 수 있습니다",
    );
  });

  it("묶음에서 승인할 책이 없으면 체크를 안내한다", () => {
    expect(footerNote({ ...base, approveBookCount: 0 })).toBe("승인할 책을 체크해 주세요");
  });

  it("한 권 신청이나 조건을 갖췄으면 안내가 없다", () => {
    expect(footerNote({ ...base, groupMode: false })).toBeUndefined();
    expect(footerNote(base)).toBeUndefined();
  });
});
