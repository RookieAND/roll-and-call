"use server";

import { findLiveReviewAuthor, insertReviewReport } from "@roll-and-call/database/web";

import { REPORT_DETAIL_MAX_LENGTH, REPORT_REASON } from "@/entities/review";
import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { getCurrentServer, getCurrentUser } from "@/shared/server";

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

  const server = await getCurrentServer();
  const authorId = await findLiveReviewAuthor({ serverId: server.id, reviewId });
  if (!authorId) return { error: "삭제된 후기입니다." };
  if (authorId === user.id) return { error: "내가 쓴 후기는 신고할 수 없습니다." };

  const note =
    reason === REPORT_REASON.other ? detail.trim().slice(0, REPORT_DETAIL_MAX_LENGTH) : "";
  try {
    await insertReviewReport({
      serverId: server.id,
      reviewId,
      reporterId: user.id,
      category: reason,
      detail: note,
    });
  } catch (error) {
    if ((error as { code?: string }).code === UNIQUE_VIOLATION) {
      return { error: "이미 신고한 후기입니다. 운영진이 확인하고 있습니다." };
    }
    throw error;
  }
  return {};
}
