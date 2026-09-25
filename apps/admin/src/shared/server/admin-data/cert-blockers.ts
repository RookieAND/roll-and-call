import { rulebookLabel } from "./rulebook-label";
import type { Snapshot } from "./snapshot";
import { supplementCores } from "./supplement-cores";
import type { CertApplication } from "./types";

type CertRecords = Pick<Snapshot, "rulebooks" | "certifications" | "certApplications" | "users">;

// 지금 심사할 수 없는 이유. waitingOn은 신청자가 심사 대기 중인 기본 룰북(서플리먼트는 그 결정 뒤에 심사),
// duplicate는 같은 판매처·주문번호를 쓴 다른 사람의 인증됨·심사 대기 신청(전자책은 승인 불가).
export function certBlockers(application: CertApplication, records: CertRecords) {
  const book = records.rulebooks.find((rulebook) => rulebook.id === application.rulebookId);
  const mine = (rulebookId: string) => (row: { userId: string; rulebookId: string }) =>
    row.userId === application.userId && row.rulebookId === rulebookId;
  const waitingOn =
    book?.kind === "supplement"
      ? supplementCores(book, records.rulebooks)
          .filter(
            (core) =>
              records.certApplications.some(
                (row) => mine(core.id)(row) && row.status === "pending",
              ) && !records.certifications.some(mine(core.id)),
          )
          .map(rulebookLabel)
      : [];

  const { seller, orderNumber } = application.purchase;
  const duplicate =
    application.format === "ebook" && seller && orderNumber
      ? records.certApplications.find(
          (row) =>
            row.userId !== application.userId &&
            row.purchase.seller === seller &&
            row.purchase.orderNumber === orderNumber &&
            row.status !== "rejected",
        )
      : undefined;

  return {
    waitingOn,
    duplicate: duplicate
      ? {
          nickname:
            records.users.find((user) => user.id === duplicate.userId)?.nickname ?? "알 수 없음",
          status: duplicate.status,
          at: duplicate.processedAt ?? duplicate.appliedAt,
        }
      : null,
  };
}

export type CertBlockers = ReturnType<typeof certBlockers>;
