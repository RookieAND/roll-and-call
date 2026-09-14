"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, games, getCurrentUser, openGameSessionRooms } from "@/shared/server";
import type { ActionResult } from "@/shared/api";

function revalidate(gameId: string) {
  revalidatePath(`/games/${gameId}`);
  revalidatePath(`/games/${gameId}/participants`);
}

async function ownsGame(gameId: string, userId: string) {
  const [row] = await db
    .select({ id: games.id })
    .from(games)
    .where(and(eq(games.id, gameId), eq(games.gmId, userId)));
  return Boolean(row);
}

// GM이 세션용 Discord 카테고리·채널을 연다. 확정 참여자만 들어간다.
export async function openSessionRooms(gameId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "로그인이 필요합니다." };
  if (!(await ownsGame(gameId, user.id))) return { error: "권한이 없습니다." };

  const result = await openGameSessionRooms(gameId);
  if (result.error) return result;

  revalidate(gameId);
  return {};
}

// 이 구인에서만 세션 채널을 끄거나 다시 켠다. GM의 자동 개설 설정보다 우선한다.
export async function setSessionRoomsEnabled(gameId: string, enabled: boolean): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "로그인이 필요합니다." };

  const updated = await db
    .update(games)
    .set({ discordRoomsDisabled: !enabled })
    .where(and(eq(games.id, gameId), eq(games.gmId, user.id)))
    .returning({ id: games.id });
  if (updated.length === 0) return { error: "권한이 없습니다." };

  revalidate(gameId);
  return {};
}
