"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, participants } from "@/shared/api/db";
import { createClient } from "@/shared/api/supabase/server";
import type { JoinActionResult } from "./join-game";

export async function leaveGame(gameId: string): Promise<JoinActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인이 필요합니다." };

  // Cancel is allowed only while recruiting. Once closed (full / past deadline /
  // confirmed) the GM must be consulted, so we block self-cancel.
  const game = await db.query.games.findFirst({
    where: (g, { eq: eqOp }) => eqOp(g.id, gameId),
    with: { participants: { columns: { userId: true } } },
  });
  if (!game) return { error: "존재하지 않는 게임입니다." };
  if (game.confirmedAt) {
    return { error: "확정된 게임은 취소할 수 없습니다. GM에게 문의하세요." };
  }
  const full = game.participants.length >= game.maxPlayers;
  const expired = game.endDate.getTime() <= Date.now();
  if (full || expired) {
    return { error: "마감된 게임은 취소할 수 없습니다. GM에게 문의하세요." };
  }

  await db
    .delete(participants)
    .where(
      and(eq(participants.gameId, gameId), eq(participants.userId, user.id)),
    );

  revalidatePath(`/games/${gameId}`);
  revalidatePath("/games");
  return {};
}
