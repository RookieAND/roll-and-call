import { and, eq, inArray, sql } from "drizzle-orm";

import { certApplications } from "../schema";
import { recordAudit, type Executor } from "./record-audit";
import type { Actor } from "./types";

export const CORE_REJECTED_TAG = "기본 룰북 반려";

// 기본 룰북 결정을 기다리던 서플리먼트 신청. 어드민 스냅숏에서 골라 넘긴다.
export interface WaitingSupplements {
  userId: string;
  nickname: string;
  coreLabel: string;
  applications: { id: string; rulebook: string }[];
}

export async function rejectWaitingSupplements({
  executor,
  serverId,
  actor,
  supplements,
}: {
  executor: Executor;
  serverId: string;
  actor: Actor;
  supplements: WaitingSupplements;
}) {
  const { userId, nickname, coreLabel, applications } = supplements;
  if (applications.length === 0) return;
  const reason = `기본 룰북(${coreLabel})이 반려되어 함께 반려되었습니다. 기본 룰북과 함께 다시 신청해 주세요.`;
  const rejected = await executor
    .update(certApplications)
    .set({
      status: "rejected",
      processedBy: actor.id,
      processedAt: sql`now()`,
      rejectTag: CORE_REJECTED_TAG,
      rejectReason: reason,
    })
    .where(
      and(
        eq(certApplications.serverId, serverId),
        inArray(
          certApplications.id,
          applications.map((application) => application.id),
        ),
        eq(certApplications.status, "pending"),
      ),
    )
    .returning({ id: certApplications.id });
  for (const application of applications.filter((row) =>
    rejected.some(({ id }) => id === row.id),
  )) {
    await recordAudit({
      executor,
      serverId,
      actor,
      entry: {
        action: "인증 반려",
        target: `${nickname} · ${application.rulebook}`,
        targetUserId: userId,
        reason,
        reasonTag: CORE_REJECTED_TAG,
        before: { label: "심사 대기" },
        after: { label: "반려됨" },
        related: [coreLabel],
      },
    });
  }
}
