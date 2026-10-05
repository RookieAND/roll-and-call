"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";

import {
  evaluateGameBadges,
  getCurrentServer,
  parseNoShowId,
  requireStaff,
  restoreNoShow,
  syncGameReviewForumPosts,
} from "@/shared/server";

interface RestoreNoShowRecordInput {
  noShowId: string;
  reason: string;
}

// 불참이 되살아나면 그 사람의 후기가 보류되고 업적이 바뀐다.
export async function restoreNoShowRecord({ noShowId, reason }: RestoreNoShowRecordInput) {
  const staff = await requireStaff();
  if (!reason.trim()) throw new Error("되돌리는 사유를 입력해 주세요");
  const server = await getCurrentServer();
  const { gameId, userId } = parseNoShowId(noShowId);
  const result = await restoreNoShow({ serverId: server.id, gameId, userId, actor: staff, reason });
  revalidatePath("/", "layout");
  if (!result.ok) return { ...result, self: result.conflict?.byId === staff.id };
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
