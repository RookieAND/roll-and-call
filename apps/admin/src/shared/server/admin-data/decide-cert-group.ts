import "server-only";
import { type CertDecision, type CertDecisionResult } from "@roll-and-call/database/certifications";
import { type Actor } from "@roll-and-call/database/moderation";

import { decideCert } from "./decide-cert";
import { loadSnapshot } from "./snapshot";

export type CertGroupDecisionResult = CertDecisionResult & { decided: number };

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
  const isCore = (rulebookId: string) =>
    snapshot.rulebooks.find((rulebook) => rulebook.id === rulebookId)?.kind === "core";
  const approving = decision.kind === "approve";
  const direction = approving ? -1 : 1;
  const ordered = applications
    .filter((row) => row !== undefined)
    .toSorted((a, b) => direction * (Number(isCore(a.rulebookId)) - Number(isCore(b.rulebookId))));
  let decided = 0;
  for (const application of ordered) {
    const result = await decideCert({ serverId, id: application.id, actor, decision });
    if (!result.ok) return { ...result, decided };
    decided += 1;
  }
  return { ok: true, userId: first.userId, decided };
}
