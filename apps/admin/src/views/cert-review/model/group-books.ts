import type { CertStatus } from "@/shared/server";

export interface GroupBookEntry {
  label: string;
  status: CertStatus;
  current: boolean;
  href: string;
}

export const GROUP_STATUS_ORDER = [
  "pending",
  "approved",
  "rejected",
  "withdrawn",
] as const satisfies readonly CertStatus[];

export const GROUP_SUMMARY_ORDER = [
  "approved",
  "rejected",
  "withdrawn",
  "pending",
] as const satisfies readonly CertStatus[];

export const GROUP_STATUS_SHORT_LABEL = {
  pending: "대기",
  approved: "승인",
  rejected: "반려",
  withdrawn: "거둠",
} as const satisfies Record<CertStatus, string>;
