import type { CertReview } from "@/shared/server";

const DECISION_LABEL = { approved: "승인", rejected: "반려" } as const;

export function processedConflictTitle({
  processed,
  viewer,
}: {
  processed: CertReview["processed"];
  viewer: string;
}) {
  if (!processed) return "";
  const decision = DECISION_LABEL[processed.status];
  if (processed.by === viewer) return `이미 ${decision}한 신청입니다`;
  return `다른 운영진(${processed.by})이 이미 ${decision}했습니다`;
}
