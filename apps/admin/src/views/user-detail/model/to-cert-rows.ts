import { CERT_FORMAT_LABEL, formatDate } from "@/shared/lib";
import type { CertFormat, UserDetail } from "@/shared/server";

import { revokeHref } from "./revoke-href";

export const CERT_ROW_STATE = {
  certified: "certified",
  pending: "pending",
  rejected: "rejected",
} as const;
export type CertRowState = (typeof CERT_ROW_STATE)[keyof typeof CERT_ROW_STATE];

const DIRECT_LABEL = "운영진 인증";

export interface CertRow {
  key: string;
  rulebook: string;
  format: string;
  state: CertRowState;
  reason: string | null;
  date: string;
  staff: string | null;
  href: string | null;
}

// 신청 없이 운영진이 준 인증(또는 그 인증을 돌린 반려)은 형식 칸에 운영진 인증으로 보인다.
const formatLabel = (format: CertFormat | null) =>
  format ? CERT_FORMAT_LABEL[format] : DIRECT_LABEL;

export function toCertRows(user: UserDetail): CertRow[] {
  const certified = user.certifications.map((certification) => ({
    key: certification.rulebookId,
    rulebook: certification.rulebook,
    format: formatLabel(certification.format),
    state: CERT_ROW_STATE.certified,
    reason: null,
    date: formatDate(certification.approvedAt),
    staff: certification.approvedBy,
    href: revokeHref({ userId: user.id, rulebookId: certification.rulebookId }),
  }));
  const pending = user.applications
    .filter((application) => application.status === "pending")
    .map((application) => ({
      key: application.id,
      rulebook: application.rulebook,
      format: formatLabel(application.format),
      state: CERT_ROW_STATE.pending,
      reason: null,
      date: formatDate(application.appliedAt),
      staff: null,
      href: `/cert/${application.id}`,
    }));
  const rejected = user.applications
    .filter((application) => application.status === "rejected")
    .map((application) => ({
      key: application.id,
      rulebook: application.rulebook,
      format: formatLabel(application.format),
      state: CERT_ROW_STATE.rejected,
      reason: application.rejectReason,
      date: formatDate(application.processedAt ?? application.appliedAt),
      staff: application.processedBy ?? null,
      href: null,
    }));
  return [...certified, ...pending, ...rejected];
}
