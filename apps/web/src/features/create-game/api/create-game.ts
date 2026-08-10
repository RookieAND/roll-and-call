"use server";

import { redirect } from "next/navigation";
import { db, games } from "@/shared/api/db";
import { createClient } from "@/shared/api/supabase/server";
import { gameFormSchema, type GameFormState } from "@/entities/game";

export async function createGame(
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

  const [created] = await db
    .insert(games)
    .values({
      kpId: user.id,
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
    .returning({ id: games.id });

  redirect(`/games/${created!.id}`);
}
