import "server-only";
import { certApplications, certifications, db, profiles, rulebooks } from "@roll-and-call/database";
import { and, eq, sql } from "drizzle-orm";

import { recordAudit } from "./record-audit";
import { rulebookLabel } from "./rulebook-label";
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
  | { ok: false; conflict: { status: "approved" | "rejected"; by: string; at: Date } };

// 승인·반려 확정. 이미 다른 운영진이 처리했으면 아무것도 바꾸지 않고 충돌을 알린다.
export async function decideCert(
  id: string,
  actor: Actor,
  decision: CertDecision,
): Promise<CertDecisionResult> {
  return db.transaction(async (tx) => {
    const approved = decision.kind === "approve";
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
          status: current.status === "approved" ? "approved" : "rejected",
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
        .onConflictDoNothing();
      await recordAudit(tx, actor, {
        action: "인증 승인",
        target,
        targetUserId: decided.userId,
        reason: "사진 4장 확인 완료",
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
    return { ok: true };
  });
}
