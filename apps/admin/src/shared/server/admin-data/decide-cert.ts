import "server-only";
import { certApplications, certifications, db, profiles, rulebooks } from "@roll-and-call/database";
import { and, eq, sql } from "drizzle-orm";

import { certBlockers } from "./cert-blockers";
import { recordAudit } from "./record-audit";
import { rejectWaitingSupplements } from "./reject-waiting-supplements";
import { rulebookLabel } from "./rulebook-label";
import { loadSnapshot } from "./snapshot";
import type { Actor, ShotKey } from "./types";

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
  | { ok: false; conflict: { status: "approved" | "rejected" | "withdrawn"; by: string; at: Date } }
  | { ok: false; blocked: string };

// 승인·반려 확정. 이미 다른 운영진이 처리했으면 아무것도 바꾸지 않고 충돌을 알린다.
// 기본 룰북이 결정되기 전의 서플리먼트는 막는다. 기본 룰북을 반려하면 기대는 서플리먼트도 반려한다.
export async function decideCert(
  id: string,
  actor: Actor,
  decision: CertDecision,
): Promise<CertDecisionResult> {
  // ponytail: 막는 조건은 트랜잭션 밖 스냅숏으로 본다. 두 운영진이 같은 순간 기본 룰북과 서플리먼트를 처리하는 경합은 막지 않는다.
  const snapshot = await loadSnapshot();
  return db.transaction(async (tx) => {
    const approved = decision.kind === "approve";
    const pendingApplication = snapshot.certApplications.find(
      (application) => application.id === id && application.status === "pending",
    );
    if (pendingApplication) {
      if (certBlockers(pendingApplication, snapshot).waitingOn.length > 0) {
        return { ok: false, blocked: "기본 룰북이 결정된 뒤에 심사할 수 있습니다" };
      }
    }
    const [decided] = await tx
      .update(certApplications)
      .set({
        status: approved ? "approved" : "rejected",
        processedBy: actor.id,
        processedAt: sql`now()`,
        ...(approved
          ? {}
          : {
              rejectTag: decision.reasonTag,
              rejectReason: decision.userReason,
              flaggedShots: decision.flaggedShots,
            }),
      })
      .where(and(eq(certApplications.id, id), eq(certApplications.status, "pending")))
      .returning();
    if (!decided) {
      const [current] = await tx
        .select({
          status: certApplications.status,
          at: certApplications.processedAt,
          by: profiles.username,
        })
        .from(certApplications)
        .leftJoin(profiles, eq(profiles.id, certApplications.processedBy))
        .where(eq(certApplications.id, id));
      if (!current) throw new Error("신청을 찾을 수 없습니다");
      return {
        ok: false,
        conflict: {
          status: current.status === "pending" ? "rejected" : current.status,
          by: current.by ?? "알 수 없음",
          at: current.at ?? new Date(),
        },
      };
    }

    const [names] = await tx
      .select({ nickname: profiles.username, name: rulebooks.name, edition: rulebooks.edition })
      .from(profiles)
      .innerJoin(rulebooks, eq(rulebooks.id, decided.rulebookId))
      .where(eq(profiles.id, decided.userId));
    const target = `${names!.nickname} · ${rulebookLabel(names!)}`;

    if (decision.kind === "approve") {
      await tx
        .insert(certifications)
        .values({ userId: decided.userId, rulebookId: decided.rulebookId, approvedBy: actor.id })
        .onConflictDoUpdate({
          target: [certifications.userId, certifications.rulebookId],
          set: {
            approvedBy: actor.id,
            approvedAt: sql`now()`,
            revokedAt: null,
            revokedBy: null,
            revokeReason: null,
          },
        });
      await recordAudit(tx, actor, {
        action: "인증 승인",
        target,
        targetUserId: decided.userId,
        reason: decided.format === "ebook" ? "구매 내역·영수증 확인 완료" : "사진 3장 확인 완료",
        before: { label: "심사 대기" },
        after: { label: "인증됨" },
      });
      return { ok: true };
    }

    await recordAudit(tx, actor, {
      action: "인증 반려",
      target,
      targetUserId: decided.userId,
      reason: decision.userReason,
      reasonTag: decision.reasonTag,
      staffMemo: decision.staffMemo || undefined,
      before: { label: "심사 대기" },
      after: { label: "반려됨" },
    });
    await rejectWaitingSupplements(tx, actor, snapshot, decided);
    return { ok: true };
  });
}
