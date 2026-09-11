"use server";

import { and, eq } from "drizzle-orm";
import { db, games, getCurrentUser } from "@/shared/server";
import type { ActionResult } from "@/shared/api";
export async function deleteGame(id: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "로그인이 필요합니다." };

  const deleted = await db
    .delete(games)
    .where(and(eq(games.id, id), eq(games.gmId, user.id)))
    .returning({ id: games.id });
  if (deleted.length === 0) return { error: "삭제 권한이 없습니다." };

  return { redirect: "/games" };
}
