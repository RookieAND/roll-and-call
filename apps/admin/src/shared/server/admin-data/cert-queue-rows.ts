import type { RulebookKind } from "@roll-and-call/database";

import { certBlockers } from "./cert-blockers";
import type { Snapshot } from "./snapshot";
import type { CertApplication, CertFormat } from "./types";
import { waitedDays } from "./waited-days";

export interface CertQueueRow {
  id: string;
  nickname: string;
  rulebook: string;
  category: string;
  kind: RulebookKind;
  format: CertFormat;
  appliedAt: Date;
  waitedDays: number;
  previousRejectionCount: number;
  activeGm: boolean;
  // 같은 사람의 기본 룰북 심사를 기다리는 서플리먼트. 목록 뒤로 보낸다.
  waiting: boolean;
  // 전자책인데 판매처 목록에 없는 이름이다(신청자가 「기타」로 입력).
  sellerUnlisted: boolean;
}

type QueueRecords = Pick<
  Snapshot,
  "users" | "rulebooks" | "certifications" | "certApplications" | "sellers"
>;

// 대기열은 정렬하지 않는다(D200). 신청일이 오래된 순이고, 기본 룰북 심사를 기다리는 서플리먼트는 맨 뒤다.
export function certQueueRows({
  records,
  applications,
}: {
  records: QueueRecords;
  applications: CertApplication[];
}) {
  const rows = applications
    .toSorted((a, b) => a.appliedAt.getTime() - b.appliedAt.getTime())
    .map((application): CertQueueRow => {
      const user = records.users.find((candidate) => candidate.id === application.userId)!;
      const book = records.rulebooks.find((rulebook) => rulebook.id === application.rulebookId);
      return {
        id: application.id,
        nickname: user.nickname,
        rulebook: application.rulebook,
        category: book?.category ?? "",
        kind: book?.kind ?? "core",
        format: application.format,
        appliedAt: application.appliedAt,
        waitedDays: waitedDays(application.appliedAt),
        previousRejectionCount: application.previousRejections.length,
        activeGm: user.recentHostedCount > 0,
        sellerUnlisted:
          application.format === "ebook" &&
          Boolean(application.purchase.seller) &&
          !records.sellers.some((seller) => seller.name === application.purchase.seller),
        waiting:
          application.status === "pending" &&
          certBlockers(application, records).waitingOn.length > 0,
      };
    });
  return [...rows.filter((row) => !row.waiting), ...rows.filter((row) => row.waiting)];
}
