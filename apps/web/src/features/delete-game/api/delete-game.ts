"use server";

import { and, eq } from "drizzle-orm";
import { db, games, getCurrentUser, removeUnusedGameFiles } from "@/shared/server";
import type { ActionResult } from "@/shared/api";
export async function deleteGame(id: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "로그인이 필요합니다." };

  const [deleted] = await db
    .delete(games)
    .where(and(eq(games.id, id), eq(games.gmId, user.id)))
    .returning({ thumbnailUrl: games.thumbnailUrl, images: games.images });
  if (!deleted) return { error: "삭제 권한이 없습니다." };

  // 지운 게임의 썸네일·진행 이미지 파일도 정리한다. 2회차가 같은 파일을 쓰면 남는다.
  await removeUnusedGameFiles([deleted.thumbnailUrl, ...deleted.images]);

  return { redirect: "/games" };
}
