import { CERT_STATE, type CertState } from "./cert-state";

interface CertRecord {
  approvedAt: Date;
  revokedAt: Date | null;
}

interface ApplicationRecord {
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  processedAt: Date | null;
}

// 룰북 하나에 대한 내 상태. 살아 있는 인증이 가장 앞서고, 그다음은 마지막 신청, 인증 취소는 그 뒤에 새 신청이 없을 때만.
export function deriveCertState(
  certification: CertRecord | undefined,
  latestApplication: ApplicationRecord | undefined,
): { state: CertState; at: Date } | null {
  if (certification && !certification.revokedAt) {
    return { state: CERT_STATE.certified, at: certification.approvedAt };
  }
  const revokedAt = certification?.revokedAt ?? null;
  const applicationIsNewer =
    latestApplication && (!revokedAt || latestApplication.createdAt > revokedAt);
  if (applicationIsNewer && latestApplication.status === "pending") {
    return { state: CERT_STATE.pending, at: latestApplication.createdAt };
  }
  if (applicationIsNewer && latestApplication.status === "rejected") {
    return {
      state: CERT_STATE.rejected,
      at: latestApplication.processedAt ?? latestApplication.createdAt,
    };
  }
  if (revokedAt) return { state: CERT_STATE.revoked, at: revokedAt };
  return null;
}
