import "server-only";
import { loadSnapshot } from "@/shared/server";

import { selectReviewRows, type ReviewListFilter } from "../model/select-review-rows";

export async function listReviews(filter: ReviewListFilter) {
  const db = await loadSnapshot();
  return selectReviewRows({ ...db, filter, now: Date.now() });
}

export type ReviewList = Awaited<ReturnType<typeof listReviews>>;
