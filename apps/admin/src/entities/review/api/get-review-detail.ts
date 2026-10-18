import "server-only";
import { loadAdminData } from "@/shared/server";

import { buildReviewDetail } from "../model/build-review-detail";
import type { ReviewListFilter } from "../model/select-review-rows";

export async function getReviewDetail({ id, filter }: { id: string; filter: ReviewListFilter }) {
  const db = await loadAdminData(["reviews", "users", "sessions", "auditLog"]);
  return buildReviewDetail({ ...db, id, filter, now: Date.now() });
}
