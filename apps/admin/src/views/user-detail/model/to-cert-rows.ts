import { formatDate, withQuery } from "@/shared/lib";
import type { StatusTone } from "@/shared/lib";
import type { UserDetail } from "@/shared/server";

export const CERT_ROW_STATE = {
  certified: "certified",
  pending: "pending",
  rejected: "rejected",
} as const;
export type CertRowState = (typeof CERT_ROW_STATE)[keyof typeof CERT_ROW_STATE];

export const CERT_ROW_LABEL: Record<CertRowState, { label: string; tone: StatusTone }> = {
  [CERT_ROW_STATE.certified]: { label: "인증됨", tone: "success" },
  [CERT_ROW_STATE.pending]: { label: "심사 대기", tone: "gray" },
  [CERT_ROW_STATE.rejected]: { label: "반려", tone: "danger" },
};

export interface CertRow {
  key: string;
  rulebook: string;
  state: CertRowState;
  reason: string | null;
  date: string;
  staff: string | null;
  action: { label: string; href: string } | null;
}

// 인증을 거두는 일은 인증 관리 한 곳에서만 한다(D294(9)). 인증됨 행은 그 화면으로 보낸다.
export function toCertRows(user: UserDetail): CertRow[] {
  const certified = user.certifications.map((certification) => ({
    key: certification.rulebookId,
    rulebook: certification.rulebook,
    state: CERT_ROW_STATE.certified,
    reason: null,
    date: `${formatDate(certification.approvedAt)} 승인`,
    staff: certification.approvedBy,
    action: {
      label: "인증 관리에서 보기",
      href: withQuery("/cert/manage", {}, { user: user.id, rulebook: certification.rulebookId }),
    },
  }));
  const pending = user.applications
    .filter((application) => application.status === "pending")
    .map((application) => ({
      key: application.id,
      rulebook: application.rulebook,
      state: CERT_ROW_STATE.pending,
      reason: null,
      date: `${formatDate(application.appliedAt)} 신청`,
      staff: null,
      action: { label: "심사하기", href: `/cert/${application.id}` },
    }));
  const rejected = user.applications
    .filter((application) => application.status === "rejected")
    .map((application) => ({
      key: application.id,
      rulebook: application.rulebook,
      state: CERT_ROW_STATE.rejected,
      reason: application.rejectReason,
      date: `${formatDate(application.processedAt ?? application.appliedAt)} 반려`,
      staff: application.processedBy ?? null,
      action: null,
    }));
  return [...certified, ...pending, ...rejected];
}
