import { reviewReasonLabel } from "@/shared/lib";

import type { Snapshot } from "./snapshot";
import { topCounts } from "./top-counts";

export function reportedReviews(db: Snapshot) {
  return db.reviews
    .filter((review) => !review.removed)
    .map((review) => {
      const open = db.reviewReports.filter(
        (report) => report.reviewId === review.id && report.open,
      );
      return {
        review,
        openReports: open,
        oldestReportedAt: new Date(Math.min(...open.map((report) => report.reportedAt.getTime()))),
        topReason: reviewReasonLabel(
          topCounts(
            open.map((report) => report.category),
            1,
          )[0]?.name ?? "",
        ),
      };
    })
    .filter((row) => row.openReports.length > 0)
    .toSorted((a, b) => a.oldestReportedAt.getTime() - b.oldestReportedAt.getTime());
}
