import { toKst } from "@/shared/lib";

import { CERT_STATE } from "./cert-state";
import { rejectionSummary } from "./rejection-summary";
import type { MyRulebook } from "./to-my-rulebooks";

export const CERT_REVIEW_TIME = "보통 2~3일 안에 확인합니다";

// 내 룰북 한 줄의 보조 문구.
export function certRowMeta({ state, stateAt, latestApplication }: MyRulebook) {
  if (!state || !stateAt) return "";
  if (state === CERT_STATE.certified) {
    return `${toKst(stateAt).format("YYYY.MM.DD")} 인증`;
  }
  if (state === CERT_STATE.pending)
    return `${toKst(stateAt).format("MM.DD")} 신청 · ${CERT_REVIEW_TIME}`;
  if (state === CERT_STATE.rejected) return rejectionSummary(latestApplication);
  return toKst(stateAt).format("MM.DD");
}
