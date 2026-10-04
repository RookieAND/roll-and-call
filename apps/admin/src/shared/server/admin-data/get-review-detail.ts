import "server-only";
import { buildReviewDetail } from "./build-review-detail";
import type { ReviewListFilter } from "./select-review-rows";
import { loadSnapshot } from "./snapshot";

export async function getReviewDetail({ id, filter }: { id: string; filter: ReviewListFilter }) {
  const db = await loadSnapshot();
  return buildReviewDetail({ ...db, id, filter, now: Date.now() });
}
