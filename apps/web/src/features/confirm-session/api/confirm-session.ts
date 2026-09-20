"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import {
  db,
  games,
  getCurrentUser,
  notifySessionConfirmed,
  refreshRecruitPost,
} from "@/shared/server";

export async function confirmSession(gameId: string, slotIso: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  const confirmedAt = new Date(slotIso);
  if (Number.isNaN(confirmedAt.getTime())) return { error: "잘못된 시간입니다." };

  const previous = await db.query.games.findFirst({
    where: (gameRow, { eq: equals }) => equals(gameRow.id, gameId),
    columns: { confirmedAt: true },
  });

  const updated = await db
    .update(games)
    // reset notifiedAt so re-confirming a new time re-arms the 1h reminder
    .set({ confirmedAt, notifiedAt: null })
    .where(and(eq(games.id, gameId), eq(games.gmId, user.id)))
    .returning({ id: games.id });

  if (updated.length === 0) return { error: "확정 권한이 없습니다." };
  await Promise.all([
    refreshRecruitPost(gameId),
    notifySessionConfirmed(gameId, previous?.confirmedAt ?? null),
  ]);

  revalidatePath(`/games/${gameId}`);
  revalidatePath(`/games/${gameId}/schedule`);
  revalidatePath(`/games/${gameId}/confirm`);
  revalidatePath(`/games/${gameId}/manage`);
  revalidatePath(`/games/${gameId}/participants`);
  revalidatePath("/games");
  return { redirect: `/games/${gameId}` };
}
