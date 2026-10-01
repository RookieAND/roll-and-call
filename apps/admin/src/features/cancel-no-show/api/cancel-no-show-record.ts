"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";

import {
  cancelNoShow,
  evaluateGameBadges,
  parseNoShowId,
  requireStaff,
  syncGameReviewForumPosts,
} from "@/shared/server";

export async function cancelNoShowRecord(noShowId: string, reason: string) {
  const staff = await requireStaff();
  if (!reason.trim()) throw new Error("취소 사유를 입력해 주세요");
  const result = await cancelNoShow(noShowId, staff, reason);
  revalidatePath("/", "layout");
  const { gameId } = parseNoShowId(noShowId);
  after(() =>
    syncGameReviewForumPosts({ gameId, siteOrigin: process.env.NEXT_PUBLIC_USER_APP_URL }),
  );
  after(() => evaluateGameBadges(gameId));
  return result;
}
