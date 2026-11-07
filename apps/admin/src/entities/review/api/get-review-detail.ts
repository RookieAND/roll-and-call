import "server-only";
import { loadAdminData, loadAuditEntries } from "@/shared/server";

import { buildReviewDetail } from "../model/build-review-detail";
import type { ReviewListFilter } from "../model/select-review-rows";

export async function getReviewDetail({ id, filter }: { id: string; filter: ReviewListFilter }) {
  const db = await loadAdminData(["reviews", "users", "sessions"]);
  // 활동 기록은 작성자가 받은 조치 수에만 쓰므로 작성자 대상 기록만 읽는다.
  const authorId = db.reviews.find((review) => review.id === id)?.authorId;
  const auditLog = authorId ? await loadAuditEntries({ targetUserId: authorId }) : [];
  return buildReviewDetail({ ...db, auditLog, id, filter, now: Date.now() });
}
