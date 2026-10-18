import "server-only";
import { loadAdminData } from "@/shared/server";

import { selectReviewRows, type ReviewListFilter } from "../model/select-review-rows";

export async function listReviews(filter: ReviewListFilter) {
  const db = await loadAdminData(["reviews", "users", "sessions"]);
  return selectReviewRows({ ...db, filter, now: Date.now() });
}

export type ReviewList = Awaited<ReturnType<typeof listReviews>>;
