import type { CertDecisionResult } from "@/shared/server";

export function decisionFailureMessage(failure: Extract<CertDecisionResult, { ok: false }>) {
  if ("blocked" in failure) return failure.blocked;
  if (failure.conflict.status === "withdrawn") return "신청자가 신청을 거뒀습니다";
  return "다른 운영진이 먼저 처리했습니다";
}
