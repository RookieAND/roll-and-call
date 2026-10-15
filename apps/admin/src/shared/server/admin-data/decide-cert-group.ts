import {
  notifyCertGroupDecision,
  type CertDecision,
  type CertDecisionResult,
} from "@roll-and-call/database/certifications";
import "server-only";
import { type Actor } from "@roll-and-call/database/moderation";
import { isUndefined } from "es-toolkit";

import { decideCert } from "./decide-cert";
import { loadSnapshot } from "./snapshot";

export type CertGroupDecisionResult = (
  | { ok: true; userId: string }
  | Extract<CertDecisionResult, { ok: false }>
) & { decided: number };

// 같은 묶음의 신청들을 한 번에 처리한다. 승인은 기본 룰북이 먼저, 반려는 서플리먼트가 먼저다.
// 기본 룰북 반려가 기대던 서플리먼트까지 반려하므로, 서플리먼트를 먼저 처리해 충돌을 만들지 않는다.
export async function decideCertGroup({
  serverId,
  ids,
  actor,
  decision,
}: {
  serverId: string;
  ids: string[];
  actor: Actor;
  decision: CertDecision;
}): Promise<CertGroupDecisionResult> {
  const snapshot = await loadSnapshot();
  const applications = ids.map((id) => snapshot.certApplications.find((row) => row.id === id));
  const first = applications[0];
  if (!first?.groupId || applications.some((row) => row?.groupId !== first.groupId)) {
    throw new Error("같은 묶음의 신청이 아닙니다");
  }
  const byId = new Map(
    applications.filter((row) => !isUndefined(row)).map((row) => [row.id, row.rulebookId]),
  );
  const isCore = (rulebookId: string) =>
    snapshot.rulebooks.find((rulebook) => rulebook.id === rulebookId)?.kind === "core";
  const approving = decision.kind === "approve";
  const direction = approving ? -1 : 1;
  const ordered = applications
    .filter((row) => !isUndefined(row))
    .toSorted((a, b) => direction * (Number(isCore(a.rulebookId)) - Number(isCore(b.rulebookId))));
  const decidedBooks: Extract<CertDecisionResult, { ok: true }>[] = [];
  let failure: Extract<CertDecisionResult, { ok: false }> | null = null;
  for (const application of ordered) {
    const result = await decideCert({
      serverId,
      id: application.id,
      actor,
      decision,
      notify: false,
    });
    if (!result.ok) {
      failure = result;
      break;
    }
    decidedBooks.push(result);
  }
  // 알림은 책마다가 아니라 한 건으로 보낸다. 대표 책은 화면 목록(ids) 순서의 첫 책이다.
  const representative = ids
    .map((id) => decidedBooks.find((book) => book.rulebookId === byId.get(id)))
    .find((book) => !isUndefined(book));
  if (representative) {
    await notifyCertGroupDecision({
      serverId,
      actor,
      userId: first.userId,
      rulebookId: representative.rulebookId,
      rulebookName: representative.rulebookName,
      otherCount: decidedBooks.length - 1,
      rejectionSummary: representative.rejectionSummary,
    });
  }
  if (failure) return { ...failure, decided: decidedBooks.length };
  return { ok: true, userId: first.userId, decided: decidedBooks.length };
}
