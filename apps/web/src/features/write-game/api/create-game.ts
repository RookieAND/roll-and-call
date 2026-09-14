"use server";

import { db, games, notifyGameCreated, getCurrentUser } from "@/shared/server";
import type { ActionResult } from "@/shared/api";
import { fromKstDateTimeInput } from "@/shared/lib";
import { gameFormSchema, type GameFormValues } from "../model/game-form";

export async function createGame(values: GameFormValues): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "로그인이 필요합니다." };

  // re-validate server-side (never trust the client)
  const parsed = gameFormSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인하세요." };
  }
  const v = parsed.data;

  const [created] = await db
    .insert(games)
    .values({
      gmId: user.id,
      title: v.title,
      rule: v.rule,
      synopsis: v.synopsis || null,
      thumbnailUrl: v.thumbnailUrl || null,
      playTime: v.playTime || null,
      maxPlayers: Number(v.maxPlayers),
      scheduleMode: v.scheduleMode,
      endDate: fromKstDateTimeInput(v.endDate),
      rangeStart: v.rangeStart || null,
      rangeEnd: v.rangeEnd || null,
      confirmedAt: v.confirmedAt ? fromKstDateTimeInput(v.confirmedAt) : null,
    })
    .returning({ id: games.id });

  const game = await db.query.games.findFirst({
    where: (g, { eq }) => eq(g.id, created!.id),
    with: { gm: { columns: { username: true } } },
  });
  if (game) await notifyGameCreated(game, game.gm?.username ?? "?");

  return { redirect: `/games/${created!.id}` };
}
