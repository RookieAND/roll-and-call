"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { countConfirmed, isSessionLocked, PARTICIPANT_STATUS } from "@/entities/game";
import { AUTH_REQUIRED_MESSAGE, GAME_NOT_FOUND_RESULT, type ActionResult } from "@/shared/api";
import {
  db,
  getCurrentUser,
  notifyGameLeft,
  participants,
  refreshRecruitPost,
} from "@/shared/server";

export async function leaveGame(gameId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  const game = await db.query.games.findFirst({
    where: (table, { eq: equals }) => equals(table.id, gameId),
    with: { participants: { columns: { userId: true, status: true } } },
  });
  if (!game) return GAME_NOT_FOUND_RESULT;

  const membership = game.participants.find((participant) => participant.userId === user.id);
  if (!membership) return { error: "참여 중이 아닙니다." };
  // 대기자는 언제든(세션 확정 후에도) 취소할 수 있고, 확정자만 확정·마감 후 자가 취소가 막혀 GM을 거친다.
  if (membership.status === PARTICIPANT_STATUS.confirmed) {
    if (isSessionLocked(game)) {
      return { error: "확정된 게임은 취소할 수 없습니다. GM에게 문의하세요." };
    }
    const full = countConfirmed(game.participants) >= game.maxPlayers;
    const expired = game.endDate.getTime() <= Date.now();
    if (expired) {
      return { error: "모집이 마감되어 취소할 수 없습니다. GM에게 문의하세요." };
    }
    if (full) {
      return { error: "정원이 차서 취소할 수 없습니다. GM에게 문의하세요." };
    }
  }

  await db
    .delete(participants)
    .where(and(eq(participants.gameId, gameId), eq(participants.userId, user.id)));
  await notifyGameLeft(gameId, user.id, false);
  await refreshRecruitPost(gameId);

  revalidatePath(`/games/${gameId}`);
  revalidatePath(`/games/${gameId}/participants`);
  revalidatePath("/games");
  return {};
}
