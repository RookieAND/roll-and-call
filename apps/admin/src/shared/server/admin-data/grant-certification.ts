import "server-only";
import { certApplications, certifications, db, profiles, rulebooks } from "@roll-and-call/database";
import { and, eq, isNotNull, sql } from "drizzle-orm";

import { recordAudit } from "./record-audit";
import { rulebookLabel } from "./rulebook-label";
import type { Actor } from "./types";

export type GrantResult = { ok: true } | { ok: false; alreadyCertified: true };

// 사진 심사 없이 운영진이 직접 인증한다. 그 GM의 대기 중 신청은 같은 트랜잭션에서 함께 승인한다.
export async function grantCertification(
  rulebookId: string,
  userId: string,
  actor: Actor,
  evidence: string,
): Promise<GrantResult> {
  return db.transaction(async (tx) => {
    const [names] = await tx
      .select({
        nickname: profiles.username,
        name: rulebooks.name,
        edition: rulebooks.edition,
        certRequired: rulebooks.certRequired,
      })
      .from(profiles)
      .innerJoin(rulebooks, eq(rulebooks.id, rulebookId))
      .where(eq(profiles.id, userId));
    if (!names) throw new Error("유저나 룰북을 찾을 수 없습니다");
    if (!names.certRequired) throw new Error("인증이 필요 없는 룰북입니다");

    // 처음 인증이면 넣고, 취소됐던 인증이면 되살린다. 이미 유효한 인증이면 아무것도 돌려받지 못한다.
    const [granted] = await tx
      .insert(certifications)
      .values({ userId, rulebookId, approvedBy: actor.id })
      .onConflictDoUpdate({
        target: [certifications.userId, certifications.rulebookId],
        set: {
          approvedBy: actor.id,
          approvedAt: sql`now()`,
          revokedAt: null,
          revokedBy: null,
          revokeReason: null,
        },
        setWhere: isNotNull(certifications.revokedAt),
      })
      .returning({ userId: certifications.userId });
    if (!granted) return { ok: false, alreadyCertified: true };

    const approvedApplications = await tx
      .update(certApplications)
      .set({ status: "approved", processedBy: actor.id, processedAt: sql`now()` })
      .where(
        and(
          eq(certApplications.userId, userId),
          eq(certApplications.rulebookId, rulebookId),
          eq(certApplications.status, "pending"),
        ),
      )
      .returning({ id: certApplications.id });

    await recordAudit(tx, actor, {
      action: "직접 인증",
      target: `${names.nickname} · ${rulebookLabel(names)}`,
      targetUserId: userId,
      reason: "운영진 직접 추가",
      staffMemo: evidence,
      before: { label: approvedApplications.length ? "심사 대기" : "미인증" },
      after: { label: "인증됨" },
      related: approvedApplications.length
        ? [`대기 중인 심사 신청 ${approvedApplications.length}건 함께 승인`]
        : [],
    });
    return { ok: true };
  });
}
