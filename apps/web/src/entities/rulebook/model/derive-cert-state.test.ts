import { describe, expect, it } from "vitest";

import { CERT_STATE } from "./cert-state";
import { deriveCertState } from "./derive-cert-state";

const at = (day: number) => new Date(Date.UTC(2026, 8, day));

describe("deriveCertState", () => {
  it("살아 있는 인증이 신청보다 앞선다", () => {
    expect(
      deriveCertState(
        { approvedAt: at(2), revokedAt: null },
        { status: "rejected", createdAt: at(5), processedAt: at(6) },
      ),
    ).toEqual({ state: CERT_STATE.certified, at: at(2) });
  });

  it("인증 취소 뒤에 낸 신청이 있으면 그 신청 상태다", () => {
    expect(
      deriveCertState(
        { approvedAt: at(2), revokedAt: at(4) },
        { status: "pending", createdAt: at(5), processedAt: null },
      )?.state,
    ).toBe(CERT_STATE.pending);
    expect(
      deriveCertState(
        { approvedAt: at(2), revokedAt: at(4) },
        { status: "approved", createdAt: at(1), processedAt: at(2) },
      )?.state,
    ).toBe(CERT_STATE.revoked);
  });

  it("반려는 처리 시각, 기록이 없으면 null", () => {
    expect(
      deriveCertState(undefined, { status: "rejected", createdAt: at(1), processedAt: at(3) }),
    ).toEqual({ state: CERT_STATE.rejected, at: at(3) });
    expect(deriveCertState(undefined, undefined)).toBeNull();
  });
});
