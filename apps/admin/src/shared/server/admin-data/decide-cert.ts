import "server-only";
import { db } from "./mock-db";
import { recordAudit } from "./record-audit";
import type { ShotKey } from "./types";

export type CertDecision =
  | { kind: "approve" }
  | {
      kind: "reject";
      reasonTag: string;
      userReason: string;
      staffMemo: string;
      flaggedShots: ShotKey[];
    };

export type CertDecisionResult =
  | { ok: true }
  | { ok: false; conflict: { status: "approved" | "rejected"; by: string; at: Date } };

// 승인·반려 확정. 이미 다른 운영진이 처리했으면 아무것도 바꾸지 않고 충돌을 알린다.
export async function decideCert(
  id: string,
  actor: string,
  decision: CertDecision,
): Promise<CertDecisionResult> {
  const application = db.certApplications.find((candidate) => candidate.id === id);
  if (!application) throw new Error("신청을 찾을 수 없습니다");
  if (application.status !== "pending") {
    return {
      ok: false,
      conflict: {
        status: application.status,
        by: application.processedBy!,
        at: application.processedAt!,
      },
    };
  }

  const nickname = db.users.find((user) => user.id === application.userId)!.nickname;
  const target = `${nickname} · ${application.rulebook}`;
  application.processedBy = actor;
  application.processedAt = new Date();

  if (decision.kind === "approve") {
    application.status = "approved";
    db.certifications.push({
      userId: application.userId,
      rulebook: application.rulebook,
      approvedAt: application.processedAt,
      approvedBy: actor,
    });
    recordAudit({ actor, action: "인증 승인", target, reason: "사진 4장 확인 완료" });
    return { ok: true };
  }

  application.status = "rejected";
  application.flaggedShots = decision.flaggedShots;
  recordAudit({
    actor,
    action: "인증 반려",
    target,
    reason: decision.userReason,
    reasonTag: decision.reasonTag,
    staffMemo: decision.staffMemo || undefined,
  });
  return { ok: true };
}
