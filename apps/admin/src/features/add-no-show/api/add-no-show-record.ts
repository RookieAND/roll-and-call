"use server";

import type { AbsenceAddedTag } from "@roll-and-call/database/games/model";
import { revalidatePath } from "next/cache";
import { after } from "next/server";

import {
  addNoShow,
  ADD_NO_SHOW_FAILURE,
  evaluateGameBadges,
  getCurrentServer,
  noShowId,
  requireStaff,
  syncGameReviewForumPosts,
} from "@/shared/server";

interface AddNoShowRecordInput {
  gameId: string;
  userId: string;
  tag: AbsenceAddedTag;
  reason: string;
}

// 고를 수 없게 된 경우(notEligible)도 그사이 다른 처리가 있었던 것이라 충돌과 같이 알린다.
export async function addNoShowRecord({ gameId, userId, tag, reason }: AddNoShowRecordInput) {
  const staff = await requireStaff();
  const server = await getCurrentServer();
  const result = await addNoShow({
    serverId: server.id,
    gameId,
    userId,
    actor: staff,
    tag,
    reason,
  });
  revalidatePath("/", "layout");
  if (!result.ok) {
    const conflict = result.reason === ADD_NO_SHOW_FAILURE.conflict ? result.conflict : null;
    return { ok: false as const, conflict, self: conflict?.byId === staff.id };
  }
  // 불참이 되면 그 사람이 쓴 후기가 보류되고 업적이 바뀐다.
  after(() =>
    syncGameReviewForumPosts({
      serverId: server.id,
      gameId,
      siteOrigin: process.env.NEXT_PUBLIC_USER_APP_URL,
    }),
  );
  after(() => evaluateGameBadges({ serverId: server.id, gameId }));
  return { ok: true as const, id: noShowId(gameId, userId) };
}
