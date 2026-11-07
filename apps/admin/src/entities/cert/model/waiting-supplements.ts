import type { WaitingSupplements } from "@roll-and-call/database/certifications";
import { supplementCores } from "@roll-and-call/database/certifications/model";
import { rulebookLabel } from "@roll-and-call/database/rulebooks/model";

interface SupplementRecords {
  users: { id: string; nickname: string }[];
  rulebooks: { id: string; name: string; edition: string; kind: string; category: string }[];
  certApplications: { id: string; userId: string; rulebookId: string; status: string }[];
}

// 이 기본 룰북 결정을 기다리던 같은 사람의 서플리먼트 신청. 기본 룰북을 반려하면 함께 반려한다.
export function waitingSupplements(
  records: SupplementRecords,
  core: { userId: string; rulebookId: string },
): WaitingSupplements | null {
  const coreBook = records.rulebooks.find((rulebook) => rulebook.id === core.rulebookId);
  if (coreBook?.kind !== "core") return null;
  const dependent = records.certApplications.flatMap((application) => {
    const book = records.rulebooks.find((rulebook) => rulebook.id === application.rulebookId);
    return application.userId === core.userId &&
      application.status === "pending" &&
      book?.kind === "supplement" &&
      supplementCores(book, records.rulebooks).some((candidate) => candidate.id === coreBook.id)
      ? [{ id: application.id, rulebook: rulebookLabel(book) }]
      : [];
  });
  if (dependent.length === 0) return null;
  return {
    userId: core.userId,
    nickname: records.users.find((user) => user.id === core.userId)?.nickname ?? "알 수 없음",
    coreLabel: rulebookLabel(coreBook),
    applications: dependent,
  };
}
