import { formatDate } from "@/shared/lib";
import type { UserDetail } from "@/shared/server";

import { revokeHref } from "./revoke-href";

export const CERT_ROW_STATE = {
  certified: "certified",
  pending: "pending",
  rejected: "rejected",
} as const;
export type CertRowState = (typeof CERT_ROW_STATE)[keyof typeof CERT_ROW_STATE];

export interface CertRow {
  key: string;
  rulebook: string;
  state: CertRowState;
  date: string;
  staff: string | null;
  href: string | null;
}

// 룰북 인증 탭의 행. 인증됨 → 심사 대기 → 반려 순으로 한 목록에 이어 붙여 페이지로 자른다.
export function toCertRows(user: UserDetail): CertRow[] {
  const certified = user.certifications.map((certification) => ({
    key: certification.rulebook,
    rulebook: certification.rulebook,
    state: CERT_ROW_STATE.certified,
    date: `${formatDate(certification.approvedAt)} 승인`,
    staff: certification.approvedBy,
    href: revokeHref(user.id, certification.rulebook),
  }));
  const pending = user.applications
    .filter((application) => application.status === "pending")
    .map((application) => ({
      key: application.id,
      rulebook: application.rulebook,
      state: CERT_ROW_STATE.pending,
      date: `${formatDate(application.appliedAt)} 신청`,
      staff: null,
      href: `/cert/${application.id}`,
    }));
  const rejected = user.applications
    .filter((application) => application.status === "rejected")
    .map((application) => ({
      key: application.id,
      rulebook: application.rulebook,
      state: CERT_ROW_STATE.rejected,
      date: application.processedAt ? `${formatDate(application.processedAt)} 반려` : "반려",
      staff: application.processedBy ?? null,
      href: null,
    }));
  return [...certified, ...pending, ...rejected];
}
