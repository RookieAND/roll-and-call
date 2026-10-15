import type { RulebookKind } from "@roll-and-call/database";

import { waitedDays } from "@/shared/lib";
import type { Snapshot, CertApplication, CertFormat } from "@/shared/server";

import { certBlockers } from "./cert-blockers";
import { mergeGroupRows } from "./merge-group-rows";

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
  // 사진 한 묶음으로 함께 신청한 책 수. 묶음이 아니면 1이고, 묶음은 한 줄로 합쳐 맨 앞 신청을 대표로 둔다.
  groupCount: number;
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
        groupCount: 1,
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
  const merged = mergeGroupRows({ rows, applications });
  return [...merged.filter((row) => !row.waiting), ...merged.filter((row) => row.waiting)];
}
