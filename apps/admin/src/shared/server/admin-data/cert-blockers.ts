import { certWaitingOn } from "./cert-waiting-on";
import type { Snapshot } from "./snapshot";
import type { CertApplication } from "./types";

type CertRecords = Pick<Snapshot, "rulebooks" | "certifications" | "certApplications" | "users">;

// 지금 심사할 수 없는 이유. waitingOn은 certWaitingOn, duplicate는 같은 판매처·주문번호를 쓴 다른 사람의 인증됨·심사 대기 신청(경고만 하고 승인은 막지 않는다).
export function certBlockers(application: CertApplication, records: CertRecords) {
  const waitingOn = certWaitingOn(application, records);

  const { seller, orderNumber } = application.purchase;
  const duplicate =
    application.format === "ebook" && seller && orderNumber
      ? records.certApplications.find(
          (row) =>
            row.userId !== application.userId &&
            row.purchase.seller === seller &&
            row.purchase.orderNumber === orderNumber &&
            (row.status === "pending" || row.status === "approved"),
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
