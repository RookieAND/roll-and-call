import type { CertApplication } from "./types";

export const CERT_SIBLING_STATUS = {
  approved: { label: "승인됨", palette: "success" },
  rejected: { label: "반려됨", palette: "danger" },
  pending: { label: "심사 대기", palette: "warning" },
  waiting: { label: "기본 룰북 결정 후 심사", palette: "gray" },
} as const;

// 같이 신청한 책 한 권의 상태. 기본 룰북을 기다리는 서플리먼트는 심사 대기와 따로 적는다.
export function certSiblingStatus(sibling: CertApplication, waitingOnCore: boolean) {
  if (sibling.status === "pending" && waitingOnCore) return CERT_SIBLING_STATUS.waiting;
  return CERT_SIBLING_STATUS[sibling.status];
}
