import type { WaitingSupplements } from "@roll-and-call/database/certifications";
import { rulebookLabel } from "@roll-and-call/database/rulebooks/model";

import type { Snapshot } from "./snapshot";
import { supplementCores } from "./supplement-cores";

// 이 기본 룰북 결정을 기다리던 같은 사람의 서플리먼트 신청. 기본 룰북을 반려하면 함께 반려한다.
export function waitingSupplements(
  snapshot: Snapshot,
  core: { userId: string; rulebookId: string },
): WaitingSupplements | null {
  const coreBook = snapshot.rulebooks.find((rulebook) => rulebook.id === core.rulebookId);
  if (coreBook?.kind !== "core") return null;
  const dependent = snapshot.certApplications.filter((application) => {
    const book = snapshot.rulebooks.find((rulebook) => rulebook.id === application.rulebookId);
    return (
      application.userId === core.userId &&
      application.status === "pending" &&
      book?.kind === "supplement" &&
      supplementCores(book, snapshot.rulebooks).some((candidate) => candidate.id === coreBook.id)
    );
  });
  if (dependent.length === 0) return null;
  return {
    userId: core.userId,
    nickname: snapshot.users.find((user) => user.id === core.userId)?.nickname ?? "알 수 없음",
    coreLabel: rulebookLabel(coreBook),
    applications: dependent.map((application) => ({
      id: application.id,
      rulebook: application.rulebook,
    })),
  };
}
