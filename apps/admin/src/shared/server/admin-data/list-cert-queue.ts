import "server-only";
import { loadSnapshot } from "./snapshot";
import { waitedDays } from "./waited-days";

export interface CertQueueFilter {
  query?: string;
  rulebook?: string;
  reappliedOnly?: boolean;
}

export interface CertQueueRow {
  id: string;
  nickname: string;
  rulebook: string;
  appliedAt: Date;
  waitedDays: number;
  previousRejectionCount: number;
}

// 오래 기다린 순. 필터와 무관한 전체 건수와 룰북 선택지도 함께 준다.
export async function listCertQueue(filter: CertQueueFilter) {
  const db = await loadSnapshot();
  const pending = db.certApplications
    .filter((application) => application.status === "pending")
    .toSorted((a, b) => a.appliedAt.getTime() - b.appliedAt.getTime())
    .map((application): CertQueueRow => ({
      id: application.id,
      nickname: db.users.find((user) => user.id === application.userId)!.nickname,
      rulebook: application.rulebook,
      appliedAt: application.appliedAt,
      waitedDays: waitedDays(application.appliedAt),
      previousRejectionCount: application.previousRejections.length,
    }));
  const rows = pending.filter(
    (row) =>
      (!filter.query || row.nickname.includes(filter.query)) &&
      (!filter.rulebook || row.rulebook === filter.rulebook) &&
      (!filter.reappliedOnly || row.previousRejectionCount > 0),
  );
  return {
    total: pending.length,
    rows,
    rulebookOptions: [...new Set(pending.map((row) => row.rulebook))].toSorted(),
  };
}
