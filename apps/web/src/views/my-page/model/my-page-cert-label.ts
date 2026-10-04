import { CERT_STATE, type CertState } from "@/entities/rulebook";

// 마이페이지 줄 배지만 짧게 쓴다(U12 보조 문구 표). 내 룰북 화면은 CERT_STATE_META 라벨 그대로다.
export const MY_PAGE_CERT_LABEL: Partial<Record<CertState, string>> = {
  [CERT_STATE.certified]: "인증",
  [CERT_STATE.pending]: "심사 중",
  [CERT_STATE.rejected]: "반려",
};
