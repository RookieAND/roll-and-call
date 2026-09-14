"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { countConfirmed, isSessionLocked, PARTICIPANT_STATUS } from "@/entities/game";
import { db, participants, getCurrentUser } from "@/shared/server";
import type { ActionResult } from "@/shared/api";
export async function leaveGame(gameId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "로그인이 필요합니다." };

  const game = await db.query.games.findFirst({
    where: (g, { eq: eqOp }) => eqOp(g.id, gameId),
    with: { participants: { columns: { userId: true, status: true } } },
  });
  if (!game) return { error: "존재하지 않는 게임입니다." };

  const me = game.participants.find((p) => p.userId === user.id);
  if (!me) return { error: "참여 중이 아닙니다." };
  if (isSessionLocked(game)) {
    return { error: "확정된 게임은 취소할 수 없습니다. GM에게 문의하세요." };
  }

  // 대기자는 언제든 대기를 취소할 수 있다. 확정자만 마감(정원 충족·기한 경과) 후
  // 자가 취소가 막히고 GM을 거친다.
  if (me.status === PARTICIPANT_STATUS.confirmed) {
    const full = countConfirmed(game.participants) >= game.maxPlayers;
    const expired = game.endDate.getTime() <= Date.now();
    if (full || expired) {
      return { error: "마감된 게임은 취소할 수 없습니다. GM에게 문의하세요." };
    }
  }

  await db
    .delete(participants)
    .where(and(eq(participants.gameId, gameId), eq(participants.userId, user.id)));

  revalidatePath(`/games/${gameId}`);
  revalidatePath(`/games/${gameId}/participants`);
  revalidatePath("/games");
  return {};
}
