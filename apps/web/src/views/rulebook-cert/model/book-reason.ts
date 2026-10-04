import { CERT_STATE, rejectionSummary, type MyRulebook } from "@/entities/rulebook";

import type { BookResult } from "./to-book-result";

export function bookReason(rulebook: MyRulebook): BookResult["reason"] {
  if (rulebook.state === CERT_STATE.rejected) {
    return {
      label: "반려 사유",
      text: rejectionSummary(rulebook.latestApplication),
      tone: "danger",
    };
  }
  if (rulebook.state === CERT_STATE.revoked) {
    return {
      label: "인증이 취소되었습니다",
      text: rulebook.revokeReason
        ? `사유: ${rulebook.revokeReason}`
        : "운영진이 인증을 취소했습니다",
      tone: "danger",
    };
  }
  return null;
}
