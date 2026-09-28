import "server-only";
import { REVIEW_REASON, reviewReasonLabel, type ReviewReason } from "@/shared/lib";

import { reportedReviews } from "./reported-reviews";
import { reviewTabCounts } from "./review-tab-counts";
import { loadSnapshot } from "./snapshot";

export interface ReportedReviewFilter {
  query?: string;
  reason?: string;
}

export async function listReportedReviews(filter: ReportedReviewFilter) {
  const db = await loadSnapshot();
  const query = filter.query?.trim().toLowerCase();
  const reasonLabel = REVIEW_REASON[filter.reason as ReviewReason];
  const rows = reportedReviews(db)
    .map(({ review, openReports, oldestReportedAt, topReason }) => ({
      id: review.id,
      authorNickname:
        db.users.find((user) => user.id === review.authorId)?.nickname ?? "알 수 없음",
      sessionTitle: db.sessions.find((session) => session.id === review.sessionId)?.title ?? "",
      reportCount: openReports.length,
      topReason,
      oldestReportedAt,
    }))
    .filter(
      (row) =>
        (!query ||
          row.authorNickname.toLowerCase().includes(query) ||
          row.sessionTitle.toLowerCase().includes(query)) &&
        (!reasonLabel || row.topReason === reasonLabel),
    );
  return {
    rows,
    counts: reviewTabCounts(db),
    reasonOptions: Object.keys(REVIEW_REASON).map((key) => ({
      value: key,
      label: reviewReasonLabel(key),
    })),
  };
}

export type ReportedReviewRow = Awaited<ReturnType<typeof listReportedReviews>>["rows"][number];
