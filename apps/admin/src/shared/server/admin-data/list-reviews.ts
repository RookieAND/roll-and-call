import "server-only";
import { selectReviewRows, type ReviewListFilter } from "./select-review-rows";
import { loadSnapshot } from "./snapshot";

export async function listReviews(filter: ReviewListFilter) {
  const db = await loadSnapshot();
  return selectReviewRows({ ...db, filter, now: Date.now() });
}

export type ReviewList = Awaited<ReturnType<typeof listReviews>>;
