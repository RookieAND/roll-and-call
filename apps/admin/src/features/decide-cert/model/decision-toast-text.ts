import { conflictToastText } from "@/shared/lib";
import type { CertDecisionResult } from "@/shared/server";

const DECISION_LABEL = { approved: "승인", rejected: "반려" } as const;

// 실패한 결정 뒤 화면을 새로 읽으면서 띄울 문구. 거둔 신청은 새로 읽은 화면의 안내로 충분해서 null이다.
export function decisionToastText({
  failure,
  viewerId,
}: {
  failure: Extract<CertDecisionResult, { ok: false }>;
  viewerId: string;
}) {
  if ("blocked" in failure) return failure.blocked;
  const { conflict } = failure;
  if (conflict.status === "withdrawn") return null;
  if (conflict.byId === viewerId) return `이미 ${DECISION_LABEL[conflict.status]}한 신청입니다`;
  return conflictToastText({ conflict, self: false, target: "신청" });
}
