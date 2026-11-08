import { CERT_STATE, type CertState } from "@/entities/rulebook";

// 마이페이지 줄 배지 문구. 인증된 줄은 상태 배지 없이 종류 배지만 둔다.
export const MY_PAGE_CERT_LABEL: Partial<Record<CertState, string>> = {
  [CERT_STATE.pending]: "확인 중",
  [CERT_STATE.rejected]: "반려됨",
};
