import { Ban, CircleAlert, CircleCheck, CirclePlus, Clock, type LucideIcon } from "lucide-react";

import { CERT_STATE, type CertState } from "./cert-state";

// 상태는 아이콘과 글자를 함께 쓴다. 인증됨 성공 색, 확인 중 중립, 반려됨 경고, 인증 취소됨 흐림.
export const CERT_STATE_META: Record<
  CertState,
  { label: string; icon: LucideIcon; foreground: "success" | "muted" | "warning" | "hint" }
> = {
  [CERT_STATE.certified]: { label: "인증됨", icon: CircleCheck, foreground: "success" },
  [CERT_STATE.pending]: { label: "확인 중", icon: Clock, foreground: "muted" },
  [CERT_STATE.rejected]: { label: "반려됨", icon: CircleAlert, foreground: "warning" },
  [CERT_STATE.revoked]: { label: "인증 취소됨", icon: Ban, foreground: "hint" },
  [CERT_STATE.requested]: { label: "추가 요청 중", icon: CirclePlus, foreground: "muted" },
};
