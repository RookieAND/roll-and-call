import { describe, expect, it } from "vitest";

import { grantBlockedReason } from "./grant-blocked-reason";

describe("grantBlockedReason", () => {
  it("먼저 채울 칸부터 알린다", () => {
    expect(
      grantBlockedReason({ bookCount: 0, userCount: 0, receivingCount: 0, evidence: "" }),
    ).toBe("룰북을 1권 이상 골라 주세요");
    expect(
      grantBlockedReason({ bookCount: 1, userCount: 0, receivingCount: 0, evidence: "" }),
    ).toBe("인증할 유저를 골라 주세요");
    expect(
      grantBlockedReason({ bookCount: 1, userCount: 1, receivingCount: 0, evidence: "x" }),
    ).toBe("고른 유저 모두 이미 인증했거나 기본 룰북이 필요해 부여할 인증이 없습니다");
    expect(
      grantBlockedReason({ bookCount: 1, userCount: 1, receivingCount: 1, evidence: "  " }),
    ).toBe("부여 사유를 입력해야 확정할 수 있습니다");
    expect(
      grantBlockedReason({ bookCount: 1, userCount: 1, receivingCount: 1, evidence: "확인" }),
    ).toBeNull();
  });
});
