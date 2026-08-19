"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, games } from "@/shared/api/db";
import { createClient } from "@/shared/api/supabase/server";

export type ConfirmResult = { error?: string; redirect?: string };

export async function confirmSession(
  gameId: string,
  slotIso: string,
): Promise<ConfirmResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인이 필요합니다." };

  const at = new Date(slotIso);
  if (Number.isNaN(at.getTime())) return { error: "잘못된 시간입니다." };

  const updated = await db
    .update(games)
    // reset notifiedAt so re-confirming a new time re-arms the 1h reminder
    .set({ confirmedAt: at, notifiedAt: null })
    .where(and(eq(games.id, gameId), eq(games.gmId, user.id)))
    .returning({ id: games.id });

  if (updated.length === 0) return { error: "확정 권한이 없습니다." };

  revalidatePath(`/games/${gameId}`);
  revalidatePath(`/games/${gameId}/schedule`);
  revalidatePath("/games");
  return { redirect: `/games/${gameId}` };
}
