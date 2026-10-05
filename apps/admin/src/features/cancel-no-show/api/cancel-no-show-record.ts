"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";

import {
  cancelNoShow,
  evaluateGameBadges,
  getCurrentServer,
  parseNoShowId,
  requireStaff,
  syncGameReviewForumPosts,
} from "@/shared/server";

interface CancelNoShowRecordInput {
  noShowId: string;
  reason: string;
}

export async function cancelNoShowRecord({ noShowId, reason }: CancelNoShowRecordInput) {
  const staff = await requireStaff();
  if (!reason.trim()) throw new Error("취소 사유를 입력해 주세요");
  const server = await getCurrentServer();
  const { gameId, userId } = parseNoShowId(noShowId);
  const result = await cancelNoShow({ serverId: server.id, gameId, userId, actor: staff, reason });
  revalidatePath("/", "layout");
  if (!result.ok) return { ...result, self: result.conflict.byId === staff.id };
  after(() =>
    syncGameReviewForumPosts({
      serverId: server.id,
      gameId,
      siteOrigin: process.env.NEXT_PUBLIC_USER_APP_URL,
    }),
  );
  after(() => evaluateGameBadges({ serverId: server.id, gameId }));
  return result;
}
