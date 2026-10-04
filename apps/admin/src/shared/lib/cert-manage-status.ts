import type { StatusTone } from "./status-tone";

export const CERT_MANAGE_STATUS = {
  certified: "certified",
  pending: "pending",
  rejected: "rejected",
} as const;
export type CertManageStatus = (typeof CERT_MANAGE_STATUS)[keyof typeof CERT_MANAGE_STATUS];

export const CERT_MANAGE_STATUS_LABEL: Record<
  CertManageStatus,
  { label: string; tone: StatusTone }
> = {
  [CERT_MANAGE_STATUS.certified]: { label: "인증됨", tone: "success" },
  [CERT_MANAGE_STATUS.pending]: { label: "심사 중", tone: "gray" },
  [CERT_MANAGE_STATUS.rejected]: { label: "반려됨", tone: "danger" },
};
