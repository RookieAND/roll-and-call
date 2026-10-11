import type { CertStatus } from "@/shared/server";

export const GROUP_STATUS_BADGE = {
  pending: { label: "심사 대기", colorPalette: "gray" },
  approved: { label: "승인", colorPalette: "success" },
  rejected: { label: "반려", colorPalette: "danger" },
  withdrawn: { label: "거둠", colorPalette: "gray" },
} as const satisfies Record<CertStatus, { label: string; colorPalette: string }>;
