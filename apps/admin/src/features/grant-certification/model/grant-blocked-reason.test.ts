import { describe, expect, it } from "vitest";

import { grantBlockedReason } from "./grant-blocked-reason";

describe("grantBlockedReason", () => {
  it("먼저 채울 칸부터 알린다", () => {
    expect(grantBlockedReason({ bookCount: 0, userCount: 0, evidence: "" })).toBe(
      "룰북을 1권 이상 골라 주세요",
    );
    expect(grantBlockedReason({ bookCount: 1, userCount: 0, evidence: "" })).toBe(
      "인증할 유저를 골라 주세요",
    );
    expect(grantBlockedReason({ bookCount: 1, userCount: 1, evidence: "  " })).toBe(
      "부여 사유를 입력해야 확정할 수 있습니다",
    );
    expect(grantBlockedReason({ bookCount: 1, userCount: 1, evidence: "확인" })).toBeNull();
  });
});
