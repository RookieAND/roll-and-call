"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db, games } from "@/shared/api/db";
import { createClient } from "@/shared/api/supabase/server";
import { gameFormSchema, type GameFormState } from "@/entities/game";

export async function updateGame(
  id: string,
  _prev: GameFormState,
  formData: FormData,
): Promise<GameFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인이 필요합니다." };

  const parsed = gameFormSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인하세요." };
  }
  const v = parsed.data;

  const updated = await db
    .update(games)
    .set({
      title: v.title,
      rule: v.rule,
      synopsis: v.synopsis ?? null,
      playTime: v.playTime ?? null,
      maxPlayers: v.maxPlayers,
      scheduleMode: v.scheduleMode,
      endDate: v.endDate,
      rangeStart: v.rangeStart ?? null,
      rangeEnd: v.rangeEnd ?? null,
      confirmedAt: v.confirmedAt ?? null,
    })
    .where(and(eq(games.id, id), eq(games.kpId, user.id)))
    .returning({ id: games.id });

  if (updated.length === 0) return { error: "수정 권한이 없습니다." };

  redirect(`/games/${id}`);
}
