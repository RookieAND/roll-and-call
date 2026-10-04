import { CERT_STATE, type CertState } from "./cert-state";

interface CertRecord {
  approvedAt: Date;
  revokedAt: Date | null;
}

interface ApplicationRecord {
  status: "pending" | "approved" | "rejected" | "withdrawn";
  createdAt: Date;
  processedAt: Date | null;
}

// 룰북 하나에 대한 내 상태. 살아 있는 인증이 가장 앞서고, 그다음은 마지막 신청이다.
// 운영진이 반려로 돌린 인증도 반려다. 보통은 마지막 신청이 반려로 바뀌어 있고, 신청 기록이 맞지 않는 옛 취소 기록만 취소 시각을 쓴다.
export function deriveCertState({
  certification,
  latestApplication,
}: {
  certification?: CertRecord;
  latestApplication?: ApplicationRecord;
}): { state: CertState; at: Date } | null {
  if (certification && !certification.revokedAt) {
    return { state: CERT_STATE.certified, at: certification.approvedAt };
  }
  if (latestApplication?.status === "pending") {
    return { state: CERT_STATE.pending, at: latestApplication.createdAt };
  }
  if (latestApplication?.status === "rejected") {
    return {
      state: CERT_STATE.rejected,
      at: latestApplication.processedAt ?? latestApplication.createdAt,
    };
  }
  if (certification?.revokedAt) return { state: CERT_STATE.rejected, at: certification.revokedAt };
  return null;
}
