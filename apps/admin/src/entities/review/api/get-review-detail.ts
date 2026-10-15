import "server-only";
import { loadSnapshot } from "@/shared/server";

import { buildReviewDetail } from "../model/build-review-detail";
import type { ReviewListFilter } from "../model/select-review-rows";

export async function getReviewDetail({ id, filter }: { id: string; filter: ReviewListFilter }) {
  const db = await loadSnapshot();
  return buildReviewDetail({ ...db, id, filter, now: Date.now() });
}
