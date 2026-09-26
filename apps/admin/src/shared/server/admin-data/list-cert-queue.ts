import "server-only";
import type { RulebookKind } from "@roll-and-call/database";

import { certBlockers } from "./cert-blockers";
import { loadSnapshot } from "./snapshot";
import type { CertFormat } from "./types";
import { waitedDays } from "./waited-days";

// 활성 GM은 최근 90일에 구인을 연 사람, 적용일 전 접수는 인증 적용일 전에 낸 신청이다.
export const CERT_QUEUE_FILTERS = {
  reapplied: "재신청",
  activeGm: "활성 GM",
  early: "적용일 전 접수",
} as const;
export type CertQueueFilterKey = keyof typeof CERT_QUEUE_FILTERS;

export interface CertQueueFilter {
  query?: string;
  rulebook?: string;
  filter?: CertQueueFilterKey;
}

export interface CertQueueRow {
  id: string;
  nickname: string;
  rulebook: string;
  kind: RulebookKind;
  format: CertFormat;
  // 기본 룰북 결정을 기다리는 서플리먼트. 목록에서 흐리게 둔다.
  waiting: boolean;
  appliedAt: Date;
  waitedDays: number;
  previousRejectionCount: number;
  activeGm: boolean;
  early: boolean;
}

// 오래 기다린 순. 필터와 무관한 전체 건수와 룰북 선택지도 함께 준다.
export async function listCertQueue(filter: CertQueueFilter) {
  const db = await loadSnapshot();
  const enforcementDate = db.settings.certEnforcementDate;
  const pending = db.certApplications
    .filter((application) => application.status === "pending")
    .toSorted((a, b) => a.appliedAt.getTime() - b.appliedAt.getTime())
    .map((application): CertQueueRow => {
      const user = db.users.find((candidate) => candidate.id === application.userId)!;
      return {
        id: application.id,
        nickname: user.nickname,
        rulebook: application.rulebook,
        kind:
          db.rulebooks.find((rulebook) => rulebook.id === application.rulebookId)?.kind ?? "core",
        format: application.format,
        waiting: certBlockers(application, db).waitingOn.length > 0,
        appliedAt: application.appliedAt,
        waitedDays: waitedDays(application.appliedAt),
        previousRejectionCount: application.previousRejections.length,
        activeGm: user.recentHostedCount > 0,
        early: enforcementDate !== null && application.appliedAt < enforcementDate,
      };
    });
  const rows = pending.filter(
    (row) =>
      (!filter.query || row.nickname.includes(filter.query)) &&
      (!filter.rulebook || row.rulebook === filter.rulebook) &&
      (filter.filter !== "reapplied" || row.previousRejectionCount > 0) &&
      (filter.filter !== "activeGm" || row.activeGm) &&
      (filter.filter !== "early" || row.early),
  );
  return {
    total: pending.length,
    rows,
    rulebookOptions: [...new Set(pending.map((row) => row.rulebook))].toSorted(),
  };
}
