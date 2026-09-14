"use server";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { PARTICIPANT_STATUS } from "@/entities/game";
import {
  createDiscordSessionRooms,
  db,
  DISCORD_ROOMS_OPENING,
  games,
  getCurrentUser,
} from "@/shared/server";
import type { ActionResult } from "@/shared/api";

// GM이 세션용 Discord 카테고리·채널을 연다. 확정 참여자만 들어간다.
export async function openSessionRooms(gameId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "로그인이 필요합니다." };

  // 동시에 두 번 눌러도 카테고리가 하나만 생기게 먼저 선점한다.
  const claimed = await db
    .update(games)
    .set({ discordCategoryId: DISCORD_ROOMS_OPENING })
    .where(and(eq(games.id, gameId), eq(games.gmId, user.id), isNull(games.discordCategoryId)))
    .returning({ id: games.id });
  if (claimed.length === 0) return { error: "권한이 없거나 이미 채널이 열려 있습니다." };

  try {
    const game = await db.query.games.findFirst({
      where: (g, { eq: eqOp }) => eqOp(g.id, gameId),
      with: {
        gm: { columns: { discordId: true } },
        participants: {
          columns: { status: true },
          with: { user: { columns: { discordId: true } } },
        },
      },
    });
    if (!game?.gm) throw new Error("game or gm not found");

    const categoryId = await createDiscordSessionRooms({
      title: game.title,
      gmDiscordId: game.gm.discordId,
      playerDiscordIds: game.participants
        .filter((p) => p.status === PARTICIPANT_STATUS.confirmed)
        .flatMap((p) => (p.user ? [p.user.discordId] : [])),
    });
    await db.update(games).set({ discordCategoryId: categoryId }).where(eq(games.id, gameId));
  } catch (err) {
    console.error("openSessionRooms failed:", err);
    await db.update(games).set({ discordCategoryId: null }).where(eq(games.id, gameId));
    return { error: "디스코드 채널을 만들지 못했습니다." };
  }

  revalidatePath(`/games/${gameId}`);
  return {};
}
