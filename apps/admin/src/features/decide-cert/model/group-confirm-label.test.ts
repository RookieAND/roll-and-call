import { describe, expect, it } from "vitest";

import { groupConfirmLabel } from "./group-confirm-label";

describe("groupConfirmLabel", () => {
  it("전부 승인", () => {
    expect(groupConfirmLabel({ approveCount: 10, rejectCount: 0 })).toBe("10권 승인");
  });
  it("전부 반려", () => {
    expect(groupConfirmLabel({ approveCount: 0, rejectCount: 3 })).toBe("3권 반려");
  });
  it("섞이면 둘 다 적는다", () => {
    expect(groupConfirmLabel({ approveCount: 8, rejectCount: 2 })).toBe("승인 8권 · 반려 2권 확정");
  });
});
