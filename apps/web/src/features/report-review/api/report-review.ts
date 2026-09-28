"use server";

import { and, eq, isNull } from "drizzle-orm";

import { REPORT_DETAIL_MAX_LENGTH, REPORT_REASON } from "@/entities/review";
import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { db, getCurrentUser, reviewReports, sessionReviews } from "@/shared/server";

import type { ReportInput } from "../model/report-input";

const UNIQUE_VIOLATION = "23505";

export async function reportReview({
  reviewId,
  reason,
  detail,
}: ReportInput): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };
  if (!Object.values(REPORT_REASON).includes(reason)) return { error: "신고 사유를 골라 주세요." };

  const [review] = await db
    .select({ authorId: sessionReviews.authorId })
    .from(sessionReviews)
    .where(and(eq(sessionReviews.id, reviewId), isNull(sessionReviews.removedAt)));
  if (!review) return { error: "삭제된 후기입니다." };
  if (review.authorId === user.id) return { error: "내가 쓴 후기는 신고할 수 없습니다." };

  const note =
    reason === REPORT_REASON.other ? detail.trim().slice(0, REPORT_DETAIL_MAX_LENGTH) : "";
  try {
    await db
      .insert(reviewReports)
      .values({ reviewId, reporterId: user.id, category: reason, detail: note });
  } catch (error) {
    if ((error as { code?: string }).code === UNIQUE_VIOLATION) {
      return { error: "이미 신고한 후기입니다. 운영진이 확인하고 있습니다." };
    }
    throw error;
  }
  return {};
}
