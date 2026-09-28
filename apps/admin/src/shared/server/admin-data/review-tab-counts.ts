import { reportedReviews } from "./reported-reviews";
import type { Snapshot } from "./snapshot";

export function reviewTabCounts(db: Snapshot) {
  return {
    reported: reportedReviews(db).length,
    hidden: db.reviews.filter((review) => review.hidden && !review.removed).length,
  };
}
