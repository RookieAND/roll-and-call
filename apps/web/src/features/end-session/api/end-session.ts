"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  archiveDiscordSessionRooms,
  db,
  DISCORD_ROOMS_OPENING,
  games,
  getCurrentUser,
} from "@/shared/server";
import type { ActionResult } from "@/shared/api";

// GM이 세션을 끝낸다: Discord 세션 채널에서 참여자 권한을 걷어내고 종료 시각을 남긴다.
export async function endSession(gameId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "로그인이 필요합니다." };

  const game = await db.query.games.findFirst({
    where: (g, { eq: eqOp }) => eqOp(g.id, gameId),
    with: { gm: { columns: { discordId: true } } },
  });
  if (!game?.gm || game.gmId !== user.id) return { error: "권한이 없습니다." };
  if (game.sessionEndedAt) return { error: "이미 종료된 세션입니다." };
  if (!game.discordCategoryId || game.discordCategoryId === DISCORD_ROOMS_OPENING) {
    return { error: "열린 세션 채널이 없습니다." };
  }

  try {
    await archiveDiscordSessionRooms(game.discordCategoryId, game.gm.discordId);
  } catch (err) {
    console.error("endSession failed:", err);
    return { error: "디스코드 채널을 정리하지 못했습니다." };
  }
  await db.update(games).set({ sessionEndedAt: new Date() }).where(eq(games.id, gameId));

  revalidatePath(`/games/${gameId}`);
  return {};
}
