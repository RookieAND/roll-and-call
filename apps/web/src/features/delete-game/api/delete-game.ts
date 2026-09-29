"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { after } from "next/server";

import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import {
  db,
  deleteGameReviewForumPosts,
  games,
  getCurrentUser,
  notifyGameCancelled,
  removeUnusedGameFiles,
} from "@/shared/server";
export async function deleteGame(id: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  const [owned] = await db
    .select({ id: games.id })
    .from(games)
    .where(and(eq(games.id, id), eq(games.gmId, user.id)));
  if (!owned) return { error: "삭제 권한이 없습니다." };
  await deleteGameReviewForumPosts(id);

  const [deleted] = await db
    .delete(games)
    .where(and(eq(games.id, id), eq(games.gmId, user.id)))
    .returning();
  if (!deleted) return { error: "삭제 권한이 없습니다." };

  after(() => notifyGameCancelled(deleted));

  // 지운 게임의 썸네일·진행 이미지 파일도 정리한다. 2회차가 같은 파일을 쓰면 남는다.
  await removeUnusedGameFiles([deleted.thumbnailUrl, ...deleted.images]);

  redirect("/games");
}
