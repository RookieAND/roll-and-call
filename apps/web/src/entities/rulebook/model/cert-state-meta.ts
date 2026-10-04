import { CircleAlert, CircleCheck, CirclePlus, Clock, type LucideIcon } from "lucide-react";

import { CERT_STATE, type CertState } from "./cert-state";

export const CERT_STATE_META: Record<
  CertState,
  { label: string; icon: LucideIcon; foreground: "success" | "muted" | "warning" | "hint" }
> = {
  [CERT_STATE.certified]: { label: "인증됨", icon: CircleCheck, foreground: "success" },
  [CERT_STATE.pending]: { label: "심사 중", icon: Clock, foreground: "muted" },
  [CERT_STATE.rejected]: { label: "반려됨", icon: CircleAlert, foreground: "warning" },
  [CERT_STATE.requested]: { label: "추가 요청 중", icon: CirclePlus, foreground: "muted" },
};
