import "server-only";
import { groupBy, minBy } from "es-toolkit";

import { reportedReviews } from "./reported-reviews";
import { loadSnapshot } from "./snapshot";
import { waitedDays } from "./waited-days";

export const PENDING_KINDS = ["cert", "rulebookRequest", "report", "reviewReport"] as const;
export type PendingKind = (typeof PENDING_KINDS)[number];

// 홈·폰 안내·⌘K의 할 일 목록은 시안 메모대로 이 셋만 보인다. 신고된 후기는 사이드바 구인 건수에만 더한다.
export const TODO_KINDS: readonly PendingKind[] = ["cert", "rulebookRequest", "report"];

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
    report: Object.values(
      groupBy(
        db.reports.filter((report) => !report.resolved),
        (report) => report.sessionId,
      ),
    ).map((reports) => minBy(reports, (report) => report.reportedAt.getTime())!.reportedAt),
    reviewReport: reportedReviews(db).map((row) => row.oldestReportedAt),
  };
  return PENDING_KINDS.map((kind) => ({
    kind,
    count: sources[kind].length,
    oldestDays: waitedDays(new Date(Math.min(...sources[kind].map(Number)))),
  }))
    .filter((item) => item.count > 0)
    .toSorted((a, b) => b.oldestDays - a.oldestDays);
}
