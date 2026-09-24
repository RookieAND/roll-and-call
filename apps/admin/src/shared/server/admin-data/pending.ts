import "server-only";
import { loadSnapshot } from "./snapshot";
import { waitedDays } from "./waited-days";

export const PENDING_KINDS = ["cert", "rulebookRequest", "report"] as const;
export type PendingKind = (typeof PENDING_KINDS)[number];

export interface PendingItem {
  kind: PendingKind;
  count: number;
  oldestDays: number;
}

// 사이드바 건수·홈 처리 대기·폰 안내·⌘K가 모두 이 한 곳에서 읽는다.
export async function getPendingItems(): Promise<PendingItem[]> {
  const db = await loadSnapshot();
  const sources: Record<PendingKind, Date[]> = {
    cert: db.certApplications
      .filter((application) => application.status === "pending")
      .map((application) => application.appliedAt),
    rulebookRequest: db.rulebookRequests
      .filter((request) => !request.processed)
      .map((request) => request.requestedAt),
    // 신고 건수가 아니라 미처리 신고가 걸린 구인 수를 센다. 구인마다 가장 오래된 신고 시각을 쓴다.
    report: [
      ...db.reports
        .filter((report) => !report.resolved)
        .reduce((oldest, report) => {
          const current = oldest.get(report.sessionId);
          if (!current || report.reportedAt < current)
            oldest.set(report.sessionId, report.reportedAt);
          return oldest;
        }, new Map<string, Date>())
        .values(),
    ],
  };
  return PENDING_KINDS.map((kind) => ({
    kind,
    count: sources[kind].length,
    oldestDays: waitedDays(new Date(Math.min(...sources[kind].map(Number)))),
  }))
    .filter((item) => item.count > 0)
    .toSorted((a, b) => b.oldestDays - a.oldestDays);
}
