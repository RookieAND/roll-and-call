import "server-only";
import { reviewReasonLabel } from "@/shared/lib";

import { reportedReviews } from "./reported-reviews";
import { loadSnapshot } from "./snapshot";
import { topCounts } from "./top-counts";

const REVIEW_ACTIONS = ["후기 숨김", "후기 제거"];

export async function getReviewDetail(id: string) {
  const db = await loadSnapshot();
  const review = db.reviews.find((candidate) => candidate.id === id && !candidate.removed);
  if (!review) return null;
  const session = db.sessions.find((candidate) => candidate.id === review.sessionId)!;
  const author = db.users.find((user) => user.id === review.authorId)!;
  const nicknameOf = (userId: string | undefined) =>
    db.users.find((user) => user.id === userId)?.nickname ?? "알 수 없음";
  const openReports = db.reviewReports
    .filter((report) => report.reviewId === id && report.open)
    .toSorted((a, b) => a.reportedAt.getTime() - b.reportedAt.getTime());
  const firstReportedAt = openReports[0]?.reportedAt;
  const receivedActions = db.auditLog.filter(
    (entry) =>
      entry.targetUserId === author.id &&
      REVIEW_ACTIONS.includes(entry.action) &&
      entry.target.startsWith(`${author.nickname}의 후기`),
  );

  return {
    id: review.id,
    body: review.body,
    spoiler: review.spoiler,
    photoUrls: review.photoUrls,
    createdAt: review.createdAt,
    editedAt: review.editedAt,
    editedAfterReport: Boolean(
      firstReportedAt && review.editedAt && review.editedAt > firstReportedAt,
    ),
    hidden: review.hidden
      ? { ...review.hidden, reasonLabel: reviewReasonLabel(review.hidden.reason) }
      : undefined,
    held: review.held,
    session: { id: session.id, title: session.title },
    author: {
      id: author.id,
      nickname: author.nickname,
      joinedAt: author.joinedAt,
      reviewCount: db.reviews.filter((candidate) => candidate.authorId === author.id).length,
      hideCount: receivedActions.filter((entry) => entry.action === "후기 숨김").length,
      removeCount: receivedActions.filter((entry) => entry.action === "후기 제거").length,
    },
    reports: openReports.map((report) => ({
      id: report.id,
      reporterNickname: nicknameOf(report.reporterId),
      reportedAt: report.reportedAt,
      reason: reviewReasonLabel(report.category),
      detail: report.detail,
    })),
    reasonCounts: topCounts(
      openReports.map((report) => reviewReasonLabel(report.category)),
      Infinity,
    ),
    topReasonKey: topCounts(
      openReports.map((report) => report.category),
      1,
    )[0]?.name,
    nextReportedId: reportedReviews(db).find((row) => row.review.id !== id)?.review.id ?? null,
  };
}

export type ReviewDetail = NonNullable<Awaited<ReturnType<typeof getReviewDetail>>>;
