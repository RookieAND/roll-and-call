import "server-only";
import { certApplications } from "@roll-and-call/database";
import { and, eq, inArray, sql } from "drizzle-orm";

import { recordAudit, type Executor } from "./record-audit";
import { rulebookLabel } from "./rulebook-label";
import type { Snapshot } from "./snapshot";
import { supplementCores } from "./supplement-cores";
import type { Actor } from "./types";

export const CORE_REJECTED_TAG = "기본 룰북 반려";

// 기본 룰북을 반려하면 그 책에 기대는 같은 사람의 심사 대기 서플리먼트도 함께 반려한다.
export async function rejectWaitingSupplements(
  executor: Executor,
  actor: Actor,
  snapshot: Snapshot,
  core: { userId: string; rulebookId: string },
) {
  const coreBook = snapshot.rulebooks.find((rulebook) => rulebook.id === core.rulebookId);
  if (coreBook?.kind !== "core") return;
  const dependent = snapshot.certApplications.filter((application) => {
    const book = snapshot.rulebooks.find((rulebook) => rulebook.id === application.rulebookId);
    return (
      application.userId === core.userId &&
      application.status === "pending" &&
      book?.kind === "supplement" &&
      supplementCores(book, snapshot.rulebooks).some((candidate) => candidate.id === coreBook.id)
    );
  });
  if (dependent.length === 0) return;

  const coreLabel = rulebookLabel(coreBook);
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
        inArray(
          certApplications.id,
          dependent.map((application) => application.id),
        ),
        eq(certApplications.status, "pending"),
      ),
    )
    .returning({ id: certApplications.id });
  const nickname = snapshot.users.find((user) => user.id === core.userId)?.nickname ?? "알 수 없음";
  for (const application of dependent.filter((row) => rejected.some(({ id }) => id === row.id))) {
    await recordAudit(executor, actor, {
      action: "인증 반려",
      target: `${nickname} · ${application.rulebook}`,
      targetUserId: core.userId,
      reason,
      reasonTag: CORE_REJECTED_TAG,
      before: { label: "심사 대기" },
      after: { label: "반려됨" },
      related: [coreLabel],
    });
  }
}
