"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, games, getCurrentUser, openGameSessionRooms, refreshRecruitPost } from "@/shared/server";
import type { ActionResult } from "@/shared/api";
export async function confirmSession(gameId: string, slotIso: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "로그인이 필요합니다." };

  const at = new Date(slotIso);
  if (Number.isNaN(at.getTime())) return { error: "잘못된 시간입니다." };

  const updated = await db
    .update(games)
    // reset notifiedAt so re-confirming a new time re-arms the 1h reminder
    .set({ confirmedAt: at, notifiedAt: null })
    .where(and(eq(games.id, gameId), eq(games.gmId, user.id)))
    .returning({ id: games.id, categoryId: games.discordCategoryId, disabled: games.discordRoomsDisabled });

  if (updated.length === 0) return { error: "확정 권한이 없습니다." };
  await refreshRecruitPost(gameId);

  // GM이 자동 개설을 켜 두었고 이 구인에서 끄지 않았으면, 확정하는 순간 세션 채널을 연다.
  // 채널 실패가 확정을 되돌리지는 않는다(참여자 관리에서 다시 열 수 있다).
  const [row] = updated;
  if (row && !row.categoryId && !row.disabled) {
    const gm = await db.query.profiles.findFirst({
      where: (p, { eq: eqOp }) => eqOp(p.id, user.id),
      columns: { discordAutoOpen: true },
    });
    if (gm?.discordAutoOpen) await openGameSessionRooms(gameId);
  }

  revalidatePath(`/games/${gameId}`);
  revalidatePath(`/games/${gameId}/schedule`);
  revalidatePath(`/games/${gameId}/participants`);
  revalidatePath("/games");
  return { redirect: `/games/${gameId}` };
}
