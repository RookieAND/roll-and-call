"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { hasUserJoined, isGameGm, SCHEDULE_MODE } from "@/entities/game";
import { availabilities, db } from "@/shared/api/db";
import { createClient } from "@/shared/api/supabase/server";

export type SaveResult = { error?: string };

export async function saveAvailability(gameId: string, slotIsos: string[]): Promise<SaveResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인이 필요합니다." };

  const game = await db.query.games.findFirst({
    where: (g, { eq: eqOp }) => eqOp(g.id, gameId),
    columns: { gmId: true, scheduleMode: true, confirmedAt: true },
    with: { participants: { columns: { userId: true } } },
  });
  if (!game) return { error: "존재하지 않는 게임입니다." };
  if (game.scheduleMode !== SCHEDULE_MODE.coordinate) {
    return { error: "일시가 지정된 게임은 조율 대상이 아닙니다." };
  }
  if (game.confirmedAt) return { error: "이미 일정이 확정된 게임입니다." };

  const involved =
    isGameGm({ gmId: game.gmId, userId: user.id }) ||
    hasUserJoined({ participants: game.participants, userId: user.id });
  if (!involved) {
    return { error: "참여자만 가능 시간을 등록할 수 있습니다." };
  }

  // Trust boundary: drop anything that isn't a valid instant, and cap the count.
  const rows = slotIsos
    .filter((iso) => !Number.isNaN(new Date(iso).getTime()))
    .slice(0, 2000)
    .map((iso) => ({ gameId, userId: user.id, slotStart: new Date(iso) }));

  await db.transaction(async (tx) => {
    await tx
      .delete(availabilities)
      .where(and(eq(availabilities.gameId, gameId), eq(availabilities.userId, user.id)));
    if (rows.length > 0) await tx.insert(availabilities).values(rows);
  });

  revalidatePath(`/games/${gameId}/schedule`);
  return {};
}
