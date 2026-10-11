import { describe, expect, it } from "vitest";

import { bulkNoticeLabel } from "./bulk-notice-label";

describe("bulkNoticeLabel", () => {
  it("첫 책 이름 뒤에 나머지 권수를 붙인다", () => {
    expect(bulkNoticeLabel({ labels: ["A", "B", "C"] })).toBe("A 외 2권");
  });

  it("한 권이면 이름만 적는다", () => {
    expect(bulkNoticeLabel({ labels: ["A"] })).toBe("A");
  });
});
