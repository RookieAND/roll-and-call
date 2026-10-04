import { and, eq, sql } from "drizzle-orm";

import { db } from "#/client";
import { recordAudit } from "#/modules/moderation/commands/record-audit";
import type { Actor, ShotKey } from "#/modules/moderation/model/types";
import { createNotifications } from "#/modules/notifications/commands/create-notifications";
import { NOTIFICATION_KIND } from "#/modules/notifications/model/notification-kind";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";
import { rulebookLabel } from "#/modules/rulebooks/model/rulebook-label";
import { certApplications, certifications, profiles, rulebooks } from "#/schema";

import { rejectionSummary } from "../model/rejection-summary";
import { rejectWaitingSupplements, type WaitingSupplements } from "./reject-waiting-supplements";

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
  | {
      ok: false;
      conflict: {
        status: "approved" | "rejected" | "withdrawn";
        by: string;
        byId: string | null;
        at: Date;
      };
    }
  | { ok: false; blocked: string };

// 이미 다른 운영진이 처리했으면 아무것도 바꾸지 않고(알림도 없이) 충돌을 알린다.
// 기본 룰북을 반려하면 그 결정을 기다리던 서플리먼트(waitingSupplements)도 반려한다.
export async function decideCertApplication({
  serverId,
  id,
  actor,
  decision,
  waitingSupplements,
}: {
  serverId: string;
  id: string;
  actor: Actor;
  decision: CertDecision;
  waitingSupplements: WaitingSupplements | null;
}): Promise<CertDecisionResult> {
  const thisApplication = and(eq(certApplications.serverId, serverId), eq(certApplications.id, id));
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
      .where(and(thisApplication, eq(certApplications.status, "pending")))
      .returning();
    if (!decided) {
      const [current] = await tx
        .select({
          status: certApplications.status,
          at: certApplications.processedAt,
          by: memberNicknameSql(serverId),
          byId: certApplications.processedBy,
        })
        .from(certApplications)
        .leftJoin(profiles, eq(profiles.id, certApplications.processedBy))
        .where(thisApplication);
      if (!current) throw new Error("신청을 찾을 수 없습니다");
      return {
        ok: false,
        conflict: {
          status: current.status === "pending" ? "rejected" : current.status,
          by: current.by ?? "알 수 없음",
          byId: current.byId,
          at: current.at ?? new Date(),
        },
      };
    }

    const [names] = await tx
      .select({
        nickname: memberNicknameSql(serverId),
        name: rulebooks.name,
        edition: rulebooks.edition,
      })
      .from(profiles)
      .innerJoin(rulebooks, eq(rulebooks.id, decided.rulebookId))
      .where(eq(profiles.id, decided.userId));
    const rulebookName = rulebookLabel(names!);
    const target = `${names!.nickname} · ${rulebookName}`;
    const rulebook = { rulebookId: decided.rulebookId, rulebookName };

    if (decision.kind === "approve") {
      await tx
        .insert(certifications)
        .values({
          serverId,
          userId: decided.userId,
          rulebookId: decided.rulebookId,
          approvedBy: actor.id,
        })
        .onConflictDoUpdate({
          target: [certifications.serverId, certifications.userId, certifications.rulebookId],
          set: {
            approvedBy: actor.id,
            approvedAt: sql`now()`,
            revokedAt: null,
            revokedBy: null,
            revokeReason: null,
            discardedAt: null,
          },
        });
      await recordAudit({
        executor: tx,
        serverId,
        actor,
        entry: {
          action: "인증 승인",
          target,
          targetUserId: decided.userId,
          reason: decided.format === "ebook" ? "구매 내역·영수증 확인 완료" : "사진 3장 확인 완료",
          before: { label: "심사 대기" },
          after: { label: "인증됨" },
        },
      });
      await createNotifications({
        executor: tx,
        serverId,
        actorId: actor.id,
        notifications: [
          { userId: decided.userId, kind: NOTIFICATION_KIND.certApproved, params: rulebook },
        ],
      });
      return { ok: true };
    }

    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "인증 반려",
        target,
        targetUserId: decided.userId,
        reason: decision.userReason,
        reasonTag: decision.reasonTag,
        staffMemo: decision.staffMemo || undefined,
        before: { label: "심사 대기" },
        after: { label: "반려됨" },
      },
    });
    await createNotifications({
      executor: tx,
      serverId,
      actorId: actor.id,
      notifications: [
        {
          userId: decided.userId,
          kind: NOTIFICATION_KIND.certRejected,
          params: { ...rulebook, rejectionSummary: rejectionSummary(decided) },
        },
      ],
    });
    if (waitingSupplements) {
      await rejectWaitingSupplements({
        executor: tx,
        serverId,
        actor,
        supplements: waitingSupplements,
      });
    }
    return { ok: true };
  });
}
