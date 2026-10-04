import { CERT_STATE, type MyRulebook } from "@/entities/rulebook";

import type { BookResult } from "./to-book-result";

export function bookReason(rulebook: MyRulebook): BookResult["reason"] {
  if (rulebook.state !== CERT_STATE.rejected || !rulebook.rejection) return null;
  return { label: "반려 사유", text: rulebook.rejection, tone: "danger" };
}
