import { CERT_ROW_STATE, type CertRowState } from "./to-cert-rows";

interface CertStateView {
  label: string;
  tone: "success" | "warning" | "danger";
  action: { label: string; variant: "ghost" | "outline"; tone: "danger" | "gray" } | null;
}

export const CERT_STATE_VIEW: Record<CertRowState, CertStateView> = {
  [CERT_ROW_STATE.certified]: {
    label: "인증됨",
    tone: "success",
    action: { label: "인증 취소", variant: "ghost", tone: "danger" },
  },
  [CERT_ROW_STATE.pending]: {
    label: "심사 대기",
    tone: "warning",
    action: { label: "심사 열기", variant: "outline", tone: "gray" },
  },
  [CERT_ROW_STATE.rejected]: { label: "반려", tone: "danger", action: null },
};
